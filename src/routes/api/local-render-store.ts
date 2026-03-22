/**
 * In-memory store for tracking local render progress.
 * Used when AWS Lambda is not configured.
 */

const CLEANUP_DELAY_MS = 10 * 60 * 1000; // 10 minutes

export type LocalRenderStatus =
	| {type: 'in-progress'; overallProgress: number}
	| {type: 'done'; outputFile: string; outputSizeInBytes: number}
	| {type: 'error'; error: string};

const localRenders = new Map<string, LocalRenderStatus>();
const cleanupTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const setLocalRenderProgress = (
	renderId: string,
	status: LocalRenderStatus,
) => {
	localRenders.set(renderId, status);

	if (status.type === 'done' || status.type === 'error') {
		const existing = cleanupTimers.get(renderId);
		if (existing) {
			clearTimeout(existing);
		}

		cleanupTimers.set(
			renderId,
			setTimeout(() => {
				localRenders.delete(renderId);
				cleanupTimers.delete(renderId);
			}, CLEANUP_DELAY_MS),
		);
	}
};

export const getLocalRenderProgress = (
	renderId: string,
): LocalRenderStatus | undefined => {
	return localRenders.get(renderId);
};

export const cleanupLocalRender = (renderId: string) => {
	const timer = cleanupTimers.get(renderId);
	if (timer) {
		clearTimeout(timer);
		cleanupTimers.delete(renderId);
	}

	localRenders.delete(renderId);
};
