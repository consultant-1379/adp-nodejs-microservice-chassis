# Dependency handling

This section covers the technical aspect of the dependency handling.
For 3pp registration check the [FOSS handling chapter](release-manual.md#foss-handling).

## Intro

[NPM](https://docs.npmjs.com/cli/v7/commands/npm) is used as package manager for NodeJS projects.
In an NPM project the `package.json` file contains information about the dependencies.
Chassis repo contains multiple npm projects and each of them has its own package descriptor.

It is important to distinguish between _development_ and _product_ dependencies. _Development_
dependencies are used during development, CI, testing and other similar phases (e.g. test frameworks,
lint tools etc.). For them there are no strict rules.

_Product_ dependencies are used at normal execution of the service (e.g. EUISDK libraries, ExpressJs
etc.). Such dependencies **must** be registered in Bazaar. [FOSS handling](release-manual.md#foss-handling)
Also security and vulnerability aspects of these dependencies are important.

## Package versions

The `package.json` contains the required dependencies which are fetched from remote repositories.
Each project contains an `.npmrc` file which defines from where to fetch these packages. If not set
otherwise npm falls back to the global user settings, where the default is _registry.npm.org_.
Internally every package _must_ come from an ARM repository.

NPM uses semantic versioning (3 part: major, minor, patch) for package versions. In `package.json` the
version of dependencies can be defined multiple way, like exact version, match minor, match major.

The currently installed exact versions are stored in `package-lock.json` files, which are also
committed to the repository. By this the environment can be consistently reproduced on different
machines.

## Manage versions

NPM provides a set of commands to handle dependencies. Normally these commands affects both
production and development dependencies, but with the `--production` or `--save-dev` flags it
can be controlled.

All the cases the commands respect the semver rules to find the best matching version.
For most command it is possible to specify packages to limit the executed command.

See [NPM CLI Reference](https://docs.npmjs.com/cli/v7/commands/npm) for more information.

Install dependencies

```bash
npm install
```

List dependencies with outdated versions.
When the latest version is in the semver range, it is colored by yellow.
Red is used when latest version needs major version change.

```bash
npm outdated
```

Update dependency versions to the latest matching according to the semver rules. _Note:_ this command
always updates the product dependencies.

```bash
npm update
```

### Update to latest versions

Keeping the devDependencies updated can help to use the latest version of the different tools.
However handling and upgrading dependencies with the default npm tools can be cumbersome,
so instead the [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) tool can be used.

This can handle multiple npm projects at once and also can separate development and production
dependencies. Also support include/exclude lists if any case a dependency should not be updated to
the latest version.
To set project specific configs add / edit the `.ncurc.json` files in the projects.

```bash
# To run the preconfigured tool on all project
npm run update-dev-dependencies
# If new versions are added to package.jsons, call install
npm run install:all
```

## Dependency considerations

This section collects information and known issues about the 3pp dependency handling.

### Root project

`node-fetch@3` supports only ESM Imports. CommonJS is no longer supported.
As in Chassis CommonJs is still used, use `node-fetch@2` until transform to ESM is not done.

Keep other 3pps up to date.

### Integration test project

See `mochawesome-report-generator` limitation at [Launcher](#launcher).

### UI Service

No known limitation, keep all 3pps up to date.

### Launcher

#### filemanager-webpack-plugin - ^2.0.5

This is the last version of the file manager plugin which works with our webpack build.
In 3.0.0+ version a 3pp is changed (cpx to cpy), which does not keep the original folder structure.
In the EUISDK build process this feature is used heavily.
Related github issue to track: <https://github.com/gregnb/filemanager-webpack-plugin/issues/94>

There can be other solution to replace this plugin with other webpack plugins.

#### mochawesome-report-generator - ^3.1.5

This is a report generator, but cannot be updated due other dependencies.
`wdio-mochawesome-reporter` limits this:
[version compatibility](https://github.com/fijijavis/wdio-mochawesome-reporter#version-compatibility)

As the `wdio-mochawesome-reporter` seems to be an abandoned project, the solution can be to use
other reporter. Other solution is to convert the output of the reporter, which can be consumed by
the report generator.

- [Reporter output](https://github.com/fijijavis/wdio-mochawesome-reporter/blob/master/src/index.js)
- [Report generator schema](https://github.com/adamgruber/mochawesome-report-generator/blob/master/src/bin/types.js)

#### NodeJS native module polyfilling in Webpack 5+ -

Webpack 5+ is no longer polyfills NodeJS core modules. As there can be modules, especially
testing related ones which use such module some extra step is needed. The error message
describes it too.

<https://github.com/webpack/webpack/pull/8460/commits/a68426e9255edcce7822480b78416837617ab065>

Generally it is enough to add the relevant polyfill as dev dependency,
e.g. `SinonJS` requires the `util` library: `npm install util --save-dev`

Also the `webpack.ProviderPlugin` can help by defining custom module resolution,
e.g. add `process` support for `fetch-mock`:

1. modify the related webpack config, add a resolve.fallback parameter:

   ```js
   const webpack = require('webpack');

   module.exports = {
     // ...
     plugins: [
       new webpack.ProvidePlugin({
         process: 'process/browser.js',
       }),
     ],
     // ...
   };
   ```

2. install the module: `npm install process --save-dev`

#### webpack-dev-server

The `webpack-dev-server` is used for local UI development. In **webpack@5** there where some changes
which affects this workflow. Minimum version to support webpack@5: 3.10.0+

The stable version 4.0.0 is released, so it is used in then launcher project.
The config is different from v3, so the default EUISDK webpack config must be changed a bit.

##### Changes in webpack.config

- `contentBase` -> `static`
- `before: (app) => {}` -> `onBeforeSetupMiddleware: ({app}) => {}` _(note the change in function parameter)_

##### Disable-host-check

Dev server has hostname check against malicious attack. In the selenium test environment this check
must be changed as the mock server runs on a different host name.

Set the `--allowed-hosts <hostname>` switch. Note: the `all` option does not work in 4.0.0,
but it is fixed on master so it is expected to work in later versions.

To check the hostname setting locally, set the desired hostname in the OS hosts file for 127.0.0.1
and start the dev server with the allowed-hosts switch. Then reach the new hostname in a browser
to test if everything works normally.

##### Host

The default hostname is 0.0.0.0 or [::] for ipv6, which is not supported by many browsers.
As a workaround the `host` parameter has to be set to `localhost`

In github there are multiple relevant issues to watch: <https://github.com/webpack/webpack-dev-server/issues/2943>
