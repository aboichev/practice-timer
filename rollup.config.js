import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

export default [{
	input: 'src/options.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'dist/js/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('dist/css/bundle.css');
			}		
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs()
	],
	watch: {
		clearScreen: false
	}
},
// background bundle
{
	input: 'src/background.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'background',
		file: 'dist/js/background.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production
		}),
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs()
	],	
},
// popup bundle
{
	input: 'src/popup.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'dist/js/popup-bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('dist/css/popup-bundle.css');
			}		
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),
		// copy files to dist
		copy({
			targets: [
				{ src: ['src/index.html',
						'src/options.html',
						'src/popup.html',
						'src/favicon.png',
						'src/manifest.json'
						],
				  dest: 'dist' },
				{ src: 'src/global.css', dest: 'dist/css'},
				{ src: 'src/images/**/*', dest: 'dist/images' }
			]
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('dist'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}