import esbuild from 'esbuild';
import esbuildConfig from './esbuildConfig.js';

esbuild
	.context(esbuildConfig)
	.then((ctx) => ctx.watch())
