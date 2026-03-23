/**
 * Local file upload endpoint.
 * Receives PUT requests with raw file data (used when AWS S3 is not configured).
 * The editor uploads to this URL instead of S3.
 */

import {Route} from './+types/upload-file';
import {saveLocalFile} from './local-file-store';

export const action = async ({request, params}: Route.ActionArgs) => {
	const key = params.key;
	if (!key) {
		return new Response('Missing file key', {status: 400});
	}

	const arrayBuffer = await request.arrayBuffer();
	saveLocalFile(key, Buffer.from(arrayBuffer));

	return new Response(null, {status: 200});
};
