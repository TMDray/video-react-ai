import {
	PresignErrorResponse,
	PresignResponse,
} from '../../editor/assets/types';
import {formatBytes} from '../../editor/utils/format-bytes';
import {Route} from './+types/upload';

const MAX_FILE_UPLOAD_SIZE_IN_MB = 1000;

export const action = async ({request}: Route.ActionArgs) => {
	try {
		const json = await request.json();
		if (!Number.isFinite(json.size)) {
			throw new Error('size is not a number');
		}
		if (typeof json.contentType !== 'string') {
			throw new Error('contentType is not a string');
		}

		if (json.size > 1024 * 1024 * MAX_FILE_UPLOAD_SIZE_IN_MB) {
			return Response.json(
				{
					code: 'FILE_TOO_LARGE',
					message: `File may not be over ${MAX_FILE_UPLOAD_SIZE_IN_MB}MB. Yours is ${formatBytes(json.size)}.`,
				},
				{status: 413},
			);
		}

		const fileKey = crypto.randomUUID();
		const origin = new URL(request.url).origin;
		const localUrl = `${origin}/api/upload-file/${fileKey}`;

		const response: PresignResponse = {
			presignedUrl: localUrl,
			readUrl: localUrl,
			fileKey,
		};

		return Response.json(response);
	} catch (error) {
		const errorResponse: PresignErrorResponse = {
			code: 'UNKNOWN_ERROR',
			message: 'Upload service unavailable',
		};

		// eslint-disable-next-line no-console
		console.error('Upload API error:', error);
		return Response.json(errorResponse, {status: 500});
	}
};
