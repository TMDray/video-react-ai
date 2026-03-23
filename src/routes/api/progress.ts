import {
	GetProgressPayload,
	GetProgressResponse,
} from '../../editor/rendering/types';
import {Route} from './+types/progress';
import {getLocalRenderProgress} from './local-render-store';

export const action = async ({request}: Route.ActionArgs) => {
	try {
		const body = (await request.json()) as GetProgressPayload;

		if (typeof body.bucketName !== 'string') {
			throw new Error('bucketName is not set');
		}

		if (typeof body.renderId !== 'string') {
			throw new Error('renderId is not set');
		}

		const localProgress = getLocalRenderProgress(body.renderId);

		if (!localProgress) {
			const response: GetProgressResponse = {
				type: 'error',
				error: 'Render not found',
			};
			return Response.json(response);
		}

		if (localProgress.type === 'done') {
			const response: GetProgressResponse = {
				type: 'done',
				outputFile: localProgress.outputFile,
				outputSizeInBytes: localProgress.outputSizeInBytes,
				outputName: localProgress.outputFile.split('/').pop() ?? 'video',
			};
			return Response.json(response);
		}

		if (localProgress.type === 'error') {
			const response: GetProgressResponse = {
				type: 'error',
				error: localProgress.error,
			};
			return Response.json(response);
		}

		const response: GetProgressResponse = {
			type: 'in-progress',
			overallProgress: localProgress.overallProgress,
		};
		return Response.json(response);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Progress API error:', error);
		return Response.json(
			{
				type: 'error',
				error:
					error instanceof Error
						? error.message
						: 'Progress service unavailable',
			} as GetProgressResponse,
			{status: 500},
		);
	}
};
