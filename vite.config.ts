import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), reactRouter()],
	optimizeDeps: {
		holdUntilCrawlEnd: true,
		exclude: [
			// These libraries do export an ESM version and therefore
			// do not need to be optimized.
			'remotion',
			'@remotion/player',
			'@remotion/gif',
			'@remotion/google-fonts/from-info',
			'@remotion/layout-utils',
			'@remotion/shapes',
		],
	},
});
