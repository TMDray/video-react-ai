import {
	renderMediaOnLambda,
	speculateFunctionName,
} from '@remotion/lambda/client';
import {execFile} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
	RenderVideoPayload,
	RenderVideoResponse,
} from '../../editor/rendering/types';
import {getEditorExportFileName} from '../../editor/utils/export-file-name';
import {generateRandomId} from '../../editor/utils/generate-random-id';
import {collectFontInfoFromItems} from '../../editor/utils/text/collect-font-info-from-items';
import {
	COMP_NAME,
	DISK_SIZE_IN_MB,
	LOCAL_RENDER_OUTPUT_DIR,
	MEM_SIZE_IN_MB,
	SITE_NAME,
	TIMEOUT_IN_SECONDS,
} from '../../remotion/constants';
import type {CompositionWithContextsProps} from '../../remotion/main';
import {Route} from './+types/render';
import {setLocalRenderProgress} from './local-render-store';

const isAwsConfigured = (): boolean => {
	return Boolean(
		process.env.REMOTION_AWS_ACCESS_KEY_ID &&
			process.env.REMOTION_AWS_SECRET_ACCESS_KEY &&
			process.env.REMOTION_AWS_REGION &&
			process.env.REMOTION_AWS_BUCKET_NAME,
	);
};

const startLocalRender = ({
	inputProps,
	codec,
	renderId,
}: {
	inputProps: CompositionWithContextsProps;
	codec: 'h264' | 'vp8';
	renderId: string;
}) => {
	setLocalRenderProgress(renderId, {
		type: 'in-progress',
		overallProgress: 0,
	});

	const outputDir = path.resolve(process.cwd(), LOCAL_RENDER_OUTPUT_DIR);
	fs.mkdirSync(outputDir, {recursive: true});

	const extension = codec === 'h264' ? 'mp4' : 'webm';
	const outputLocation = path.join(outputDir, `${renderId}.${extension}`);

	// Write inputProps to a temp file for the CLI
	const propsFile = path.join(outputDir, `${renderId}.props.json`);
	fs.writeFileSync(propsFile, JSON.stringify(inputProps));

	const entryPoint = path.resolve(
		process.cwd(),
		'src',
		'remotion',
		'index.ts',
	);

	// Use Remotion CLI via child_process — avoids Vite/esbuild native binary issues
	const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
	const child = execFile(
		npxPath,
		[
			'remotion',
			'render',
			entryPoint,
			COMP_NAME,
			'--output',
			outputLocation,
			'--codec',
			codec,
			'--props',
			propsFile,
		],
		{maxBuffer: 10 * 1024 * 1024},
		(error) => {
			// Cleanup props file
			try {
				fs.unlinkSync(propsFile);
			} catch {
				// ignore
			}

			if (error) {
				// eslint-disable-next-line no-console
				console.error('Local render error:', error.message);
				setLocalRenderProgress(renderId, {
					type: 'error',
					error: error.message || 'Local render failed',
				});
				return;
			}

			try {
				const stats = fs.statSync(outputLocation);
				setLocalRenderProgress(renderId, {
					type: 'done',
					outputFile: `/api/render/download?id=${renderId}&ext=${extension}`,
					outputSizeInBytes: stats.size,
				});
			} catch {
				setLocalRenderProgress(renderId, {
					type: 'error',
					error: 'Render completed but output file not found',
				});
			}
		},
	);

	// Parse progress from stderr (Remotion CLI outputs progress there)
	if (child.stderr) {
		child.stderr.on('data', (data: Buffer) => {
			const text = data.toString();
			// Remotion CLI outputs lines like "(50% done)"
			const match = text.match(/\((\d+)%\s*done\)/);
			if (match) {
				const percent = parseInt(match[1], 10) / 100;
				setLocalRenderProgress(renderId, {
					type: 'in-progress',
					overallProgress: percent,
				});
			}
		});
	}
};

export const action = async ({request}: Route.ActionArgs) => {
	try {
		const body = (await request.json()) as RenderVideoPayload;

		if (!Number.isFinite(body.compositionHeight)) {
			throw new Error('compositionHeight is not a number');
		}
		if (!Number.isFinite(body.compositionWidth)) {
			throw new Error('compositionWidth is not a number');
		}
		if (!Array.isArray(body.tracks)) {
			throw new Error('tracks is not an array');
		}
		if (!body.codec || (body.codec !== 'h264' && body.codec !== 'vp8')) {
			throw new Error('codec must be either "h264" or "vp8"');
		}

		const inputProps: CompositionWithContextsProps = {
			compositionHeight: body.compositionHeight,
			compositionWidth: body.compositionWidth,
			assets: body.assets,
			items: body.items,
			tracks: body.tracks,
			fontInfos: collectFontInfoFromItems(Object.values(body.items)),
		};

		// Lambda path: use AWS if configured
		if (isAwsConfigured()) {
			const {requireServerEnv} = await import(
				'../../editor/utils/server-env'
			);
			const serverEnv = requireServerEnv();

			const {bucketName, renderId} = await renderMediaOnLambda({
				codec: body.codec,
				inputProps,
				composition: COMP_NAME,
				functionName: speculateFunctionName({
					diskSizeInMb: DISK_SIZE_IN_MB,
					memorySizeInMb: MEM_SIZE_IN_MB,
					timeoutInSeconds: TIMEOUT_IN_SECONDS,
				}),
				colorSpace: 'bt709',
				region: serverEnv.REMOTION_AWS_REGION,
				serveUrl: SITE_NAME,
				downloadBehavior: {
					fileName: getEditorExportFileName(body.codec),
					type: 'download',
				},
			});

			const response: RenderVideoResponse = {
				type: 'success',
				bucketName,
				renderId,
			};

			return Response.json(response);
		}

		// Local path: render on this machine via CLI
		const renderId = generateRandomId();
		startLocalRender({inputProps, codec: body.codec, renderId});

		const response: RenderVideoResponse = {
			type: 'success',
			bucketName: 'local',
			renderId,
		};

		return Response.json(response);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error('Render API error:', e);
		const response: RenderVideoResponse = {
			type: 'error',
			error: e instanceof Error ? e.message : 'Render service unavailable',
		};

		return Response.json(response, {status: 400});
	}
};
