# Build System

The local build system is based on NPM and Bob.

A series of NPM scripts are written to ease the local development of NodeJS and EUI-SDK projects.
The root project contains multiple npm scripts, which can initialize the repository or
start development server.

**Bob** is used to execute tasks in CI, but it can be used locally as well to execute
build related tasks, eg. creating docker images, helm charts.

## NPM Tasks

### Install dependencies

Packages are handled by NPM and all dependency is defined in package.json files.
For CI there are optimized versions of the commands where some npm features are switched off
(--preffer-offline & --no-audit)

```bash
npm install:all       # Install dependencies in all project
npm ci:all            # Clean Install dependencies in all project. (optimized for quick run in CI)
```

### Start locally

Start the NodeJS Microservice Chassis service locally.

```bash
npm start             # Start NodeJS Microservice Chassis service in production mode
                      # it also serves the built launcher-gui
npm run start:dev     # Start both the server and the launcher-gui in autorefresh mode
npm run start:server  # Start the server in development mode
npm run start:gui      # Start the ui locally
```

_Note: development server runs on `http://localhost:3000` and ui server runs on `http://localhost:8080`_

### Linting

The repository has multiple static code analyzer steps, which can check it for various issues.
The analyzers have config files in the root of the repo and some has in subproject as well.

Linters and configs:

- ESLint <https://eslint.org/>
  - .eslintrc\*
  - .eslintignore
- Vale <https://github.com/errata-ai/vale/blob/v2/README.md>
  - \*.md files only
  - .vale.ini
  - \docs\styles\Vocab\EEA4_custom_terms\accept.txt, reject.txt
- Markdownlint <https://github.com/igorshubovych/markdownlint-cli>
  - .markdowlint.json
  - .markdowlintignore
- lockfile-lint <https://github.com/lirantal/lockfile-lint>
  - .lockfile-lintrc\*

```bash
npm run lint                      # execute all lint tasks
npm run lint:js                   # lint all *.js files in the repository.
npm run lint:markdown             # lint all *.md files in the repository.
npm run lint:package-lock         # lint package-lock.json files
npm run lint:project:gui          # run lint task in the gui project
npm run lint:project:backend      # run lint task in the backend project
npm run lint:project:apiDocs      # run lint task in the apiDocs project
npm run lint:allProjects          # run lint task in all projects
```
