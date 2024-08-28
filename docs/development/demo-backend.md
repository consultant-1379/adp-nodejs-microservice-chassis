# Backend

The backend folder holds an example web service with many reusable features
like logging and config handling.

## Quick NPM task reference

```bash
npm install                 # Install dependencies
npm start                   # start in normal mode
npm run start:watch         # if source is changed the server is reloaded
npm run start:debug         # start in debug mode
npm run lint                # lint source code
npm run test                # run all tests
npm run test:generateReport # generate HTML report
npm run test:coverage       # run mocha tests with coverage report
```

_Note: development server runs on `http://localhost:3000`_

## Project structure

The main goal of the project structure is to separate code in order to reuse
throughout the web application. This is achieved with the principle of separation
of concerns. In each directory modules should only implement functionalities used
in that part of the application.

```text
├── bin                     Holds the main entrypoint
├── config                  Config files and config change handlers
├── dal                     Database access logic
├── loaders                 Modules used for the startup process
├── middleware              Reusable express.js middleware
├── models                  Database models, schemas
├── routes                  Route controllers for all the endpoints of the app
├── services                Business logic of the app
├── test
    ├── component
    ├── mocks
    └── unit
├── utils                   Reusable static helper modules
└── app.js                  Creates the express.js app
```

The application starts in the `/bin` folder where the `www` scirpt configures the HTTP/HTTPS
server and adds the express.js app to the server. The express.js app is in the root of the
project. During the start up the loaders are called. Loaders should execute the initialization
process of the web service which are: setting routes to the express application, setting up
logging or any other necessary task that is required by the WS.

Routes should be set in the `/routes` folder where only controller layer logic should be written.
The commonly used url path handling codes should be moved to a middleware to improve reuse. These
codes are for example authentication checks, authorization checks, input validation. The
implemented sample application shows some examples of this.

Never add business logic to the above mentioned controller layer. All the business logic must be
implemented in services which are placed to the /services folder. Your business logic is well
separated if no Request or Response objects are passed, no status codes are passed, generally no
information is passed concerning the layer above.

Data access logic should not be stored in services. All the code parts of connecting, querying and
manipulating data should be moved to the `/dal` folder. The dedicated folder for database models is
the models folder.

Application config is also separated the contents of the /config folder is explained in the next
chapter.

## Configuration

Configuration is managed through a ConfigManager. The default values are in
a default-config.json and additional config should be set through a Helm chart.
The sample implementation merges together the default config and config from
the Helm chart.

These settings can be updated during a helm upgrade. These settings are watched
and if updated, services and effected components should handle config changes at runtime.
Services can subscribe to this update event emitted by the ConfigManager for example
the logging services is subscribed to this event and if logging config changes it
automatically applies those.

## Logging

For logging the recommended npm lib is Winston. A reusable logger module is
included in the Chassis project. The `app.js` provides an example how to log
messages with Winston.

## Performance metrics

pmService module provides API for collecting different performance metrics

In order to collect metrics from the application pmService must be initialized
by calling `pmService.setupPromClient()` and pointed to the parent express app
by calling `pmService.applyPromMiddleware(app)` by default this will start collecting some [Default Metrics](../release/content/overview.md)
and create additional endpoint `/metrics`.
applyPromMiddleware has optional second parameter, object that contains additional metric gathering [settings](https://www.npmjs.com/package/express-prom-bundle).

A custom counter or gauge can be created for other purposes by using `pmService.createMetric` method.
Example:

```js
pmService.createMetric('gauge', { name: GAUGE_METRIC_NAME });
pmService.createMetric('counter', {
  name: apiName,
  help: `Amount of requests to the "${url}" API`,
  labelNames: ['endpoint', 'method', 'code'],
});
```

To delete a metric call `pmService.deleteMetric(metricName)` and pass it's name as a parameter.

To check if metrics collection is enabled by service configs use `pmService.isEnabled()`.

To add a counter for counting requests to specific endpoints, list said endpoints under
`dependencies.prometheus.endpointsToCountRequests` in `default-config.json`
by providing its full path.

```json
{
  "dependencies": {
    "prometheus": {
      "enabled": true,
      "appName": "eric-adp-chassis",
      "endpointsToCountRequests": ["/api/ticket", "/api/tickets"],
      "tls": {
        "verifyServerCert": false,
        "sendClientCert": false
      }
    }
  }
}
```

!> If you add new metrics or modify existing ones, you must also update the metadata file
`docs/release/metadata/eric-adp-nodejs-chassis-service_pm_metrics.json` according to
[documentation](https://confluence.lmera.ericsson.se/pages/viewpage.action?pageId=261989118).\
Then run `bob generate-metrics-doc` to update **Provided metrics** section in the
`service_user_guide.md` documentation locally.\
Do not update `pm_metrics_fragment.md` manually. It will be overwritten in the CI/CD steps

Please note, that currently the pm-server doesn't work with custom certificates.

## Testing

Mocha is used as a test framework for unit and component testing and Chai is
used as an assertion library. For mocking `testdouble` is used, and examples
have been provided for both component and unit test mocking. To see the
coverage of the implemented test cases simply run `npm run test:coverage` and
the `c8` tool will create a CLI test report of the global and per module coverage
of the tests.

## Debugging

For debugging component or unit tests VSCode has been configured. Either running
all the tests or a selected test file just place a breakpoint anywhere in the
running test code and start debugging.

// TODO write about debugging in a K8S cluster.
