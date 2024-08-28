import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';
import glob from 'glob';

// creates an array of all JS files to be minified
const jsFilesToMinify = glob.sync('build/**/*.js');

const miniConfig = {
  input: jsFilesToMinify.filter(s => !s.includes('index.js')),
  output: [
    {
      dir: 'build',
      format: 'esm',
      preserveModules: true,
    },
  ],
  plugins: [
    // Minify HTML template literals
    minifyHTML(),
    // Minify JS
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    // Print bundle summary
    // Not necessary - but useful to show file sizes
    summary(),
  ],
  onwarn: warning => {
    // Skip This set to undefined warning
    // see warning message https://rollupjs.org/guide/en/#error-this-is-undefined
    // for more information on this
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }

    // console.warn everything else
    // eslint-disable-next-line no-console
    console.warn(warning.message);
  },
};

export default [miniConfig];
