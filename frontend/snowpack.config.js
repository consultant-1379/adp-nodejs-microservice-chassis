import { createRequire } from 'module';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const require = createRequire(import.meta.url);

const { devDependencies } = require('./package.json');
const externalModules = require('./public/config.package.json').modules;

const CONFIG = {
  workspaceRoot: '/',
  mount: {
    public: '/',
    src: '/src',
    './node_modules/@eui/theme/dist/fonts': {
      url: '/assets/fonts',
      resolve: false,
      static: true,
    },
    './node_modules/@eui/theme': {
      url: '/libs/shared/@eui/theme',
      static: true,
    },
    './node_modules/@eui/container': {
      url: '/libs/shared/@eui/container',
      static: true,
    },
    './node_modules/@eui/app': {
      url: '/libs/shared/@eui/app',
      static: true,
    },
    './node_modules/@eui/lit-component': {
      url: '/libs/shared/@eui/lit-component',
      static: true,
    },
    './node_modules/@eui/component': {
      url: '/libs/shared/@eui/component',
      static: true,
    },
    './node_modules/@eui/navigation-menu': {
      url: '/libs/shared/@eui/navigation-menu',
      resolve: true,
      static: false,
    },
  },
  plugins: ['@eui/import-css-plugin'],
  packageOptions: {
    polyfillNode: true,
    rollup: {
      plugins: [nodeResolve()],
    },
    external: [
      ...Object.keys(devDependencies),
      ...externalModules.map(module => module.name),
    ],
    knownEntrypoints: ['@open-wc/testing-helpers'],
  },
  devOptions: {},
  buildOptions: {
    metaUrlPath: 'libs',
  },
};

/** @type {import("snowpack").SnowpackUserConfig } */
export default CONFIG;
