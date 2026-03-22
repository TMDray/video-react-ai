import {type RouteConfig, index, prefix, route} from '@react-router/dev/routes';

export default [
	index('routes/index.tsx'),
	...prefix('api', [
		route('/upload', 'routes/api/upload.ts'),
		route('/progress', 'routes/api/progress.ts'),
		route('/render', 'routes/api/render.ts'),
		route('/render/download', 'routes/api/download.ts'),
		route('/captions', 'routes/api/captions.ts'),
		route('/fonts/:name', 'routes/api/font.ts'),
	]),
] satisfies RouteConfig;
