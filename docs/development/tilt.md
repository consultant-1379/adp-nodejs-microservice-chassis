# Tilt

Tilt is a development tool for Kubernetes based development.
It speeds up the local deployment of an application during code change.

## Install

- Windows <https://docs.tilt.dev/install.html#windows>

  - Install from a Powershell terminal:

  ```PowerShell
  iex ((new-object net.webclient).DownloadString('https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.ps1'))
  ```

  - add Tilt to PATH
  - check it by executing: `tilt`

## Local execution

The default mode is `local`. In local mode the used namespace is `default`
if `exactnamespace` option is not set.
This mode is preferred when using docker desktop or other local kubernetes cluster.
To start using locally just jump to [Usage](#usage)
For other options check the [Configuration](#configuration) chapter.

For local testing an Nginx is required. The easiest way to install to use helm.

## Prerequirements

- If you would like to test the integration with the ADP services, then
  you have to refresh the helm dependencies under the charts/ci folder.

```bash
cd charts/ci
helm repo add proj-adp-gs-all-helm \
https://arm.sero.gic.ericsson.se/artifactory/proj-adp-gs-all-helm/ \
--username <your-username> \
--password <your-password-or-token>
helm dep update
```

- You have to install an ingress controller, because ingress resources are used during the tilt
  deployment.
  Please use the following command:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx/
helm install ingress-nginx ingress-nginx/ingress-nginx
```

## Quick start

These are the quick steps to start working with a remote cluster.
For detailed explanations or troubleshooting check the [Remote execution](#remote-execution) chapter.

1. configure kubectl context to use the dev cluster

   ```bash
   export KUBECONFIG=$HOME/.kube/config:$(pwd)/mock/cluster-config/presentation-big.yaml
   kubectl config use-context big-presentation
   ```

2. save `tilt.options.user.template.json` as `tilt.options.user.json`
3. add your SIGNUM and ARM API key and set `mode` to `remote` in `tilt.options.user.json`
4. start tilt: `tilt up`. See [Usage](#usage)

?> In the remote development a unique namespace is created for your deployments.
To interact with them add the namespace to your context or append the namespace flag to all kubectl command.

## Configuration

The main Tiltfile is in the root: `Tiltfile`
It uses some configuration files to define where to connect and how create the resources.
`tilt.options.json` is the default configuration which is merged into the repo.
It can be overwritten with `tilt.options.user.json` which is gitignored to avoid unnecessary changes.
Mostly the execution mode (local / remote) and the ARM credentials can be defined there, but any
option can be overridden if needed.

`tilt.options.json` - this is a generic options file which is used as default config

```json
{
  "mode": "local", // can be local or remote
  "exactnamespace": "", // The exact namespace to be used. It is used in local mode too if given
  // the next attributes are used only in remote mode
  "arm_url": "armdocker.rnd.ericsson.se", // ARM url
  "arm_repo": "proj-eea-dev", // ARM project
  "pull_secret": "arm-pullsecret", // name of the pull secret to be created in the namespace
  // The namespace prefix to generate unique name. Only used if 'exactnamespace' is an empty string
  "namespace_prefix": "nodejs-microservice-dev",
  "kubecontext": "big-presentation", // The kubecontext used for remote connection,
  "dockerUser": "", // Shall be set only in the user config
  "dockerPassword": "", // Shall be set only in the user config
  "deployCiChart": false, // Deploy CI dependency chart, please read the Prerequirements section
  "deployMockServices": true, //Deploy dummy services to test the discovery functionality
  "deployMainService": true, //Build and deploy the NodeJS Chassis Service
  "ingressHost": "localhost" // Ingress hostname
}
```

`tilt.option.user.json` - this is a gitignored file to store user specific configs
like ARM credential information. Create this file and add the following json structure.
Any other attribute from the `tilt.option.json` can be added to define custom value for it.
Check the `tilt.option.user.template.json` for an empty example.

```json
{
  "mode": "local",
  "dockerUser": "<SIGNUM>",
  "dockerPassword": "<ENCRYPTED_ARM_SELI_PASSWORD>" // or use API_KEY which is never expires
}
```

## Remote execution

To configure remote mode follow the [Quick steps](#remote-execution-quick-start).
For detailed explanations or troubleshooting read the next chapters.

### Summary

In remote mode the Tiltfile does some extra initialization steps based on `tilt.options.json`:

- generate unique namespace
- create the namespace
- create a pullsecret in the namespace
- login to the ARM docker repo
- and allow the kubectl context defined in the configuration

To use a remote cluster the kubectl context has to be changed to connect to a remote cluster.
For the UI Service developer team the development cluster is `seliics01760e01`, but other teams shall
use their own cluster. See the K8S.io docs: [Configure Access to Multiple Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
To speed up configuration the required kubectl config files for `seliics01760e01`
are committed into the repository.

### Kubectl context

Change kubectl context to point to the remote cluster (seliics01760e01).

```bash
# If KUBECONFIG is empty add the default config from HOME first
export KUBECONFIG=$HOME/.kube/config
# Add dev cluster config to KUBECONFIG
export KUBECONFIG=$KUBECONFIG:$(pwd)/mock/cluster-config/kube-config.yaml
# Check the result. Both seliics01760e01 and docker-desktop shall be present
kubectl config view
# To switch back to local cluster
kubectl config use-context kubernetes-admin@dev-presentation
# To switch back to local cluster
kubectl config use-context docker-desktop
```

### Configure Tilt

For more info about the configuration see: [Configuration](#configuration)

Change the `tilt.options.json` file.

- set mode to `remote`
  - by default no other config change is necessary
  - and also the namespace is: \<namespace_prefix\>-\<dockerUser\>
  - but if the `exactnamespace` is set in the config then that is used as namespace
- ingressHost attribute should be configured with the ingress
  loadbalancer node name. In big-presentation context the ingress host is
  seliics01760e01.seli.gic.ericsson.se.
- then set your context to that namespace:
  `kubectl config set-context --current --namespace=<NAMESPACE NAME>`
- save the `tilt.options.arm.template.json` as `tilt.options.arm.json` and add your SIGNUM and password

## Usage

To start tilt: `tilt up`

Then press space to open Tilt console in a browser. It will show the process of the build and
the status of the services. At first time it builds the docker images which may take time.
When finished the logs of the processes can be seen on the UI.

To stop: `Ctrl+C` then `tilt down` to remove services from kubernetes.
_Note: by default the namespaces created by Tilt are not deleted._
To do use the --delete-namespaces flag: `tilt down --delete-namespaces`

If anything is changed (eg. Docker file, source code, Tiltfile),
then the build process is automatically restarted and the changed services are replaced
with the new version. The config is optimized for fast update, but the overall time depends
which part of the code is changed.

## Remote debugging

The debugger port is opened for the NodeJS Chassis Service and the mock services so it is possible
to remote connect with the `Attach to Backend in K8S` launch option.
Just select the project to debug and the port (eg. 9230) and attach to the process.
After a sort time the debugger is attached and nodejs will stop at breakpoints.

?> When the process is paused it cannot serve incoming requests including the K8S Liveness Endpoint.
If the pause takes longer time than the Liveness wait timeout Kubernetes will restart the Pod.
That's why for debugging it is advised to increase the `periodSeconds` at the `livenessProbe` in the
`deployment.yaml`.

## Implementation

The tilt config is based on the official [NodeJS tutorial](https://docs.tilt.dev/example_nodejs.html).
This focuses on short reload cycles, and it is achieved by multiple optimizations:

**Optimized Dockerfile**, where `npm install` is executed first and the source files are copied second.
With this, the result of npm install can be cached by the docker registry which can speed up a
docker build.

**Live update**: tilt provides a live_update mechanism where file changes can be copied into a running
pod. The service watches file changes and restarts when detects new files.
For live update there are some requirements:

- use `nodemon` to start the server. Nodemon watch files in a directory and restarts service
  if detect changes. `--ext js` is set to nodemon to avoid restarts when config files (json files,
  certificates etc.) are changed at runtime. These changes shall be handled by the service
  without restarts.
- set replicaCount to 1: live update works only with single pod deployment
- set write permission to the default user in the docker image for the service files.

If live update is not working, tilt logs out the reason.
