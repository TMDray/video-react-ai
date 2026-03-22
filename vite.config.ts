import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';

export default defineConfig({
	resolve: {
		dedupe: ['react', 'react-dom'],
	},
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
			'@remotion/media',
			'@remotion/openai-whisper',
			// Motion design packages — ESM, no optimization needed
			'@remotion/transitions',
			'@remotion/animation-utils',
			'@remotion/paths',
			'@remotion/motion-blur',
			'@remotion/noise',
			'@remotion/lottie',
			'@remotion/preload',
			'@remotion/media-utils',
			// Node.js-only packages (transitive deps) — must not be processed by esbuild
			'@remotion/renderer',
			'@remotion/bundler',
		],
	},
	ssr: {
		// Node.js-only packages with native binaries — must not be bundled
		external: [
			'@remotion/renderer',
			'@remotion/bundler',
			'@remotion/compositor-darwin-arm64',
			'@remotion/compositor-darwin-x64',
			'@remotion/compositor-win32-x64-msvc',
			'@remotion/compositor-linux-x64-musl',
			'@remotion/compositor-linux-x64-gnu',
			'@remotion/compositor-linux-arm64-musl',
			'@remotion/compositor-linux-arm64-gnu',
		],
	},
});
