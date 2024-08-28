# Demo Hello World Application

This is a demo Hello World application.

## Technology

The project uses the EUI-SDK framework to implement web applications.
It uses several 3pp libraries and frameworks in the development pipeline and in implementation.

- [EUI-SDK](https://euisdk.seli.wh.rnd.internal.ericsson.com/users/euisdk/staging/docs/euisdkdocs/#docs?chapter=overview)
  \- internal framework
  - [Lit-HTML](https://lit-html.polymer-project.org/) - html templating library
- [Webpack](https://webpack.js.org) - for build, bundle, and local development
- [Babel](https://babeljs.io) - for transpile EcmaScript
- [WebDriverIO](https://webdriver.io) - Selenium based e2e testing framework
- [Karma](https://karma-runner.github.io/latest/index.html) - Karma test runner for component tests
- [Mocha](https://mochajs.org) - Generic test framework for component and e2e tests

### Authentication and Authorization

IAM service login page used to login into SSO Realm. Parameters - styling, naming, localization, etc
can be set through IAM admin page or through configuration of the IAM/AuthProxy services.

## Common NPM tasks

For a full list of available tasks check `launcher-gui/package.json`.

```bash
npm install         # install npm dependencies
npm run build       # build the production package
npm start           # start the local dev server
npm run lint        # lint the project
npm run test        # run the component tests
npm run test:*      # run test with different options
npm run e2e:local   # run e2e tests locally
npm run e2e:*       # run e2e tests with different options
```

## Development

EUI-SDK applications can be developed locally with mocked backend services, using webpack.

Start the development server first:

```bash
npm run start
```

## Testing

Both test level uses the Mocha framework to define test cases and organize test suites.
The functionalities provided by Mocha can be freely used to control test executions like
the `.only` or the `.skip` modifiers which can be appended to any `describe` or `it` block.

### Component tests

Component tests are implemented in the Mocha test framework. The tests are run in browsers
which must be available in the current environment. Karma is the test runner framework which is
responsible to start up a confguired webpack server and open the browsers to execute tests.
_Note:_ in CI or docker environment only headless browsers are available.
For test configs check the `karma.conf.*.js` and the `webpack.config.test.*.js` files.

Tests are located next to the source code under special folder called `__tests__`. The framework
collects all files from these folders and executes them.

Run tests in Headless Chrome and Firefox (with test coverage):

```bash
npm run test                # Run tests in both Chrome and Firefox
npm run test:firefox        # Run tests only in Firefox
npm run test:chrome         # Run tests only in Chrome
```

Run tests in normal Chrome and Firefox (with test coverage). Useful to develop or debug component
tests as breakpoints can be added to the execution.

```bash
npm run test:firefox:dev    # Run tests in normal Firefox
npm run test:chrome:dev     # Run tests in normal Chrome
```

Run tests with a dev-server. It is a continuously running webserver where tests can be freely debugged.

```bash
npm run test:browser
```

#### Improvements

Some improvements are in the build configs from the generated EUISDK skeleton for Karma test runner:

- the `karma-sourcemap-loader` plugin is configured to show exact location of errors
- a global hook (`test/mochaHooks.js`) is added to catch Unhandled Rejection errors

#### In Docker

Run tests in docker image. Useful to reproduce issues with CI runs. Update some parameters:

- the docker image version
- path to the repository in the local host. It must be absolute path for docker windows

```bash
docker run -it --rm --name "test" \
  -v c:/<<<Path to repo>>>:/local/webapps \
  selidocker.lmera.ericsson.se/proj_eea/eui:1.5 bash \
  -c "cd /local/webapps && npm run test:ui"
```

### E2E tests

For E2E testing the WebdriverIO framework is used, which is a selenium based execution framework.
For test definition the Mocha framework use here. These tests are different from component tests
as test are run in NodeJS and they control a browser instance to perform various tasks.
Then the test can make asserts against the visible DOM.

The selenium tests are executed against a running GUI server. Locally it can be a development
server, but also it is possible to run e2e tests against real deployments.

Test files are located in the `test_js/specs` folder. To implement tests the PageObject pattern
is followed where there are predefined Objects which describes some part of the UI. These
PageObjects contain the low level logic how a given element can be found in DOM. The tests
itself only interacts with these POs, making them mostly readable even for non-developers.
PageObject are located in the `test_js/page-object` folder.

The configuration for the WebdriverIO is `test_js/config/wdio.conf.js`. This file parses the
CLI for arguments and can alter the actual runtime configuration based on them.

For local execution two console is required, one for the dev server and one for the test run.

```bash
npm run start       # start the development server in one console
npm run e2e:local   # execute all selenium files from the specs folder.
npm run e2e:local -- --spec <path to a spec file> # execute only the specified file
```

The runner will open a Chrome instance and starts to execute the test steps. After all spec file
are processed the browser is closed and the test execution result can be checked in the console.
For CI execution a HTML based reporter is configured for better test reports. (Mochawesome)

## Debug

### In browser

The quickest debugging option is to use the built in tools provided by browsers. The webpack
devserver is configured to generate source-map in development mode, so the browsers can work
with the original source code. Just open the developer console, open up a file and start adding
break points.

This works for UI development and also for developing _component_ tests. In case of E2E tests,
it is suitable to check the state of the browsers during test runs.

### From IDE

The repository contains many VSCode debug configuration to perform debug operations directly from
the opened source code. The common is that breakpoints can be added before or after the launch
where the execution stops. The preconfigured tasks contains information how to map source code
to the executed code, so if the folder structure is changed in the repository the tasks should be
checked.

#### UI

It is possible to use the VSCode Debugger for debugging the UI application. This way it is possible
to add breakpoints inside VSCode, to use the debug console and so on.
This mode requires the `Debugger for Chrome` VSCode extension to be installed.
It starts a Chrome instance then the VSCode is attached to it to take over the development toolbar.
The browser can be used normally and will react to breakpoints added to the source code.
Then the debug options of the VSCode can be used to inspect the current state.

The debugger will open `localhost:8080` with the Chrome instance.
And two debug processes will be under the VSCode -> Run menu.

1.**Start&Debug UI**:
If you haven't started the server yet, this process builds and start the application, and opens the debugger.

2.**Debug UI**:
If you started the webpack server with npm run start:gui, this process attaches VSCode to it,
without starting another server.

With Start&Debug, the webpack server will start in a task in the VSCode integrated terminal.
You can stop this by closing that terminal, or VSCode completely.

#### Component

For component tests the `Start&Debug Component tests` can be used. It starts the tests with Karma
and launches a Chrome instance connected to VSCode. Break points can be added both to the test and
the application source code.

#### Selenium

It is possible to quickly start the currently opened test file and add breakpoints to them.

- Start the server: `npm start`
- Select `WebdriverIO` debug config
- Add break points to spec or PageOBject files
- Run tests with `F5` or with the green play button to execute the currently open test file

!> Be aware of a few limitations in debugging due to NodeJS and WebrdiverIO. The WebrdiverIO
commands are asyncron methods, but all of them is wrapped to be usable in synchronous fashion. Due
to this, the WebrdiverIO commands cannot be executed in the debug console directly. Doing so can
hang up the test execution process.
