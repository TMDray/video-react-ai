/**
 * In-memory store for tracking local render progress.
 * Used when AWS Lambda is not configured.
 */

export type LocalRenderStatus =
	| {type: 'in-progress'; overallProgress: number}
	| {type: 'done'; outputFile: string; outputSizeInBytes: number}
	| {type: 'error'; error: string};

const localRenders = new Map<string, LocalRenderStatus>();

export const setLocalRenderProgress = (
	renderId: string,
	status: LocalRenderStatus,
) => {
	localRenders.set(renderId, status);
};

export const getLocalRenderProgress = (
	renderId: string,
): LocalRenderStatus | undefined => {
	return localRenders.get(renderId);
};

export const cleanupLocalRender = (renderId: string) => {
	localRenders.delete(renderId);
};
