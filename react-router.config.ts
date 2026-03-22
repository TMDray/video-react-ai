import type {Config} from '@react-router/dev/config';
import {vercelPreset} from '@vercel/react-router/vite';

export default {
	appDirectory: 'src',
	ssr: true,
	future: {
		// This flag is optional, but if disabled,
		// you would get an error message when starting the app for the first time
		// and you would have to refresh the page to get rid of it.
		// https://remix.run/docs/en/main/guides/dependency-optimization
		unstable_optimizeDeps: true,
	},
	// we're using Vercel to host https://editor-starter.remotion.dev
	// you can safely delete this if you're not using Vercel
	presets: [vercelPreset()],
} satisfies Config;
