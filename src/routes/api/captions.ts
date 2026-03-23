import type {Caption} from '@remotion/captions';
import {Mistral} from '@mistralai/mistralai';
import {GetCaptionsResponse} from '../../editor/captioning/types';
import {Route} from './+types/captions';
import {deleteLocalFile, getLocalFile} from './local-file-store';

const transcribeWithVoxtral = async (
	audioData: Buffer,
): Promise<Caption[]> => {
	const apiKey = process.env.MISTRAL_API_KEY;
	if (!apiKey) {
		throw new Error('MISTRAL_API_KEY is not set');
	}

	const mistral = new Mistral({apiKey});

	const transcription = await mistral.audio.transcriptions.complete({
		model: 'voxtral-mini-latest',
		file: {
			fileName: 'audio.wav',
			content: audioData,
		},
		timestampGranularities: ['word'],
	});

	if (!transcription.segments || transcription.segments.length === 0) {
		return [];
	}

	return transcription.segments.map((segment) => ({
		text: segment.text,
		startMs: Math.round(segment.start * 1000),
		endMs: Math.round(segment.end * 1000),
		timestampMs: Math.round(segment.start * 1000),
		confidence: segment.score ?? null,
	}));
};

export const action = async ({request}: Route.ActionArgs) => {
	try {
		const json = await request.json();

		if (!json.fileKey) {
			throw new Error('fileKey is required');
		}

		const data = getLocalFile(json.fileKey);
		if (!data) {
			throw new Error('Audio file not found');
		}

		const captions = await transcribeWithVoxtral(data);

		deleteLocalFile(json.fileKey);

		const captionResponse: GetCaptionsResponse = {
			captions,
		};

		return Response.json(captionResponse);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Captions API error:', error);
		return Response.json(
			{
				error:
					error instanceof Error
						? error.message
						: 'Caption service unavailable',
			},
			{status: 500},
		);
	}
};
