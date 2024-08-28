# Integration Testing

## About integration testing

The main purpose of integration tests is to ensure component integration. For the backend this
means it functions after it is deployed to a Kubernetes cluster. For the frontend this means
in the Kubernetes cluster it can work together with the backend.

Integration tests are executed during a drop pipeline execution after each commit is merged in.

## Development

Integration tests are located in the root of the git repository in the integration-tests folder.
The tests for the backend and frontend are separated to a `/backend` and a `/ui` folder.

To locally develop new test cases start the service with Tilt (execute _tilt up_).

VSCode is set up to Run and Debug tests. After the containers are started by Tilt in the run menu
use the

- "Run current test file in Backend" for backend test debugging
- "WebdriverIO integration" for frontend test debugging.

## Remote debugging

The target of the integration tests are fetched from `KUBERNETES_MASTER_NODE` and `SERVICE_PATH`
environment variables. To run tests on a service in a remote cluster export these variables and
then execute the tests.

`SERVICE_PATH` must start with a slash (/).

!> On windows Git Bash shell this causes confusion, and it must be escaped.
eg: `export SERVICE_PATH="\/jenkins-adp-nodejs-chassis-drop-418"`

!> Ingress should be configured so that the installed chassis deployment is accessible from your
development environment.

### Selenium

For Selenium tests set the `--network-config-from-env` parameter as well,
to tell the executor to take server parameters from env variables.

```bash
export KUBERNETES_MASTER_NODE=seliics01656e01.seli.gic.ericsson.se
export SERVICE_PATH="\/jenkins-adp-nodejs-chassis-drop-418"
npx wdio test/ui/config/wdio.conf.js --network-config-from-env --selenium-standalone
```

```powershell
$Env:KUBERNETES_MASTER_NODE="seliics01656e01.seli.gic.ericsson.se"
$Env:SERVICE_PATH="/jenkins-adp-nodejs-chassis-drop-418"
npx wdio test/ui/config/wdio.conf.js --network-config-from-env --selenium-standalone
```
