import esbuild from 'esbuild';
import esbuildConfig from './esbuildConfig.js';

esbuild.buildSync({
	...esbuildConfig,
	minify: true,
})
