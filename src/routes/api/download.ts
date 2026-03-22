import fs from 'node:fs';
import path from 'node:path';
import {Readable} from 'node:stream';
import {LOCAL_RENDER_OUTPUT_DIR} from '../../remotion/constants';
import {Route} from './+types/download';

export const loader = async ({request}: Route.LoaderArgs) => {
	const url = new URL(request.url);
	const id = url.searchParams.get('id');
	const ext = url.searchParams.get('ext') ?? 'mp4';

	if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
		return new Response('Invalid render ID', {status: 400});
	}

	const ALLOWED_EXTENSIONS = ['mp4', 'webm'];
	if (!ALLOWED_EXTENSIONS.includes(ext)) {
		return new Response('Invalid file extension', {status: 400});
	}

	const filePath = path.resolve(
		process.cwd(),
		LOCAL_RENDER_OUTPUT_DIR,
		`${id}.${ext}`,
	);

	if (!fs.existsSync(filePath)) {
		return new Response('File not found', {status: 404});
	}

	const stat = fs.statSync(filePath);
	const stream = fs.createReadStream(filePath);
	const contentType = ext === 'mp4' ? 'video/mp4' : 'video/webm';

	return new Response(Readable.toWeb(stream) as ReadableStream, {
		headers: {
			'Content-Type': contentType,
			'Content-Length': stat.size.toString(),
			'Content-Disposition': `attachment; filename="render-${id}.${ext}"`,
		},
	});
};
