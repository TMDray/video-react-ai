/**
 * In-memory store for temporary file uploads.
 * Used when AWS S3 is not configured (local mode).
 */

const CLEANUP_DELAY_MS = 10 * 60 * 1000; // 10 minutes

const localFiles = new Map<string, Buffer>();
const cleanupTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const saveLocalFile = (key: string, data: Buffer) => {
	localFiles.set(key, data);

	const existing = cleanupTimers.get(key);
	if (existing) {
		clearTimeout(existing);
	}

	cleanupTimers.set(
		key,
		setTimeout(() => {
			localFiles.delete(key);
			cleanupTimers.delete(key);
		}, CLEANUP_DELAY_MS),
	);
};

export const getLocalFile = (key: string): Buffer | undefined => {
	return localFiles.get(key);
};

export const deleteLocalFile = (key: string) => {
	const timer = cleanupTimers.get(key);
	if (timer) {
		clearTimeout(timer);
		cleanupTimers.delete(key);
	}

	localFiles.delete(key);
};
