# Service Deployment Guide

## Installation in Kubernetes

You can install NodeJS Chassis Service into your Kubernetes cluster via [Helm](https://helm.sh/).
These instructions are valid for Ericsson-internal users using Helm v3.

To be able to pull/push the NodeJS Chassis Service Helm chart, you need to generate an API Key
from [the SELI Artifactory](https://arm.seli.gic.ericsson.se/artifactory/webapp/#/home).
Log in, go to Edit Profile (click your username), unlock the settings by entering password
and copy the API Key.
_Note:_ alternatively the encrypted password can be used, but it can expire.

```sh
# Add the helm repository and update
helm repo add eea-drop https://arm.seli.gic.ericsson.se/artifactory/proj-eea-drop-helm \
  --username <USERNAME> --password <ARTIFACTORY_API_KEY_SELI>
helm repo update

# Add a pull secret for ARM to the kubernetes cluster
kubectl create secret docker-registry arm-pullsecret \
  --docker-server=armdocker.rnd.ericsson.se \
  --docker-username=<USERNAME> \
  --docker-password=<ARTIFACTORY_API_KEY_SELI>

# Install the service
# At the moment no stable version is available. Use --devel to get the latest development version.
# Also add the --namespace=<namespace> parameter if the service shall be installed to a different namespace
# from what is defined in the current kubectl context
helm install eric-adp-nodejs-chassis-service eea-drop/eric-adp-nodejs-chassis-service \
  --devel \
  --set imageCredentials.repoPath=proj-eea-drop \
  --set global.registry.pullSecret=arm-pullsecret

# Access Nodejs Chassis Service
kubectl port-forward svc/eric-adp-nodejs-chassis-service 3000

# Go to http://localhost:3000 in a web browser to access the GUI
# http://localhost:3000/api to access the Backend API
```

### Deployment failure

If NodeJS Chassis Service fails to start you can find information regarding the cause in the logs,
which can be viewed with `kubectl logs <name of eric-adp-nodejs-chassis-service pod>`.

## Helm chart parameters

| Parameter                                                               | Description                                                              | Default value                        |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------ |
| `configuration.logging.logLevel`                                        | The logging level for the NodeJS Microservice Chassis service            | `info`                               |
| `configuration.logging.stdoutEnabled`                                   | Logs are sent to the local console                                       | `true`                               |
| `configuration.logging.enabled`                                         | Logging is enabled                                                       | `true`                               |
| `configuration.logging.defaultLogLevel`                                 | The logging level for the NodeJS Microservice Chassis service            | `info`                               |
| `configuration.logging.serviceName`                                     | Logs service id                                                          | `eric-adp-chassis`                   |
| `configuration.logging.stdout.enabled`                                  | Logs are sent to local console                                           | `true`                               |
| `configuration.logging.filelog.enabled`                                 | Logs are sent to file                                                    | `true`                               |
| `configuration.logging.filelog.logDirName`                              | log file directory                                                       | `/logs/chassis/`                     |
| `configuration.logging.filelog.logFileName`                             | log file name                                                            | `auditChassis`                       |
| `configuration.logging.filelog.maxSize`                                 | log file max size                                                        | `5120`                               |
| `configuration.logging.filelog.maxFiles`                                | log files max quantity                                                   | `5`                                  |
| `configuration.logging.syslog.enabled`                                  | Logs are sent to syslog                                                  | `false`                              |
| `configuration.faultIndications.enabled`                                | Fault handling and alarms provisioning                                   | `true`                               |
| `configuration.dependencies.prometheus.appName`                         | Service id, will be used as a metrics prefix                             | `eric-adp-chassis`                   |
| `configuration.dependencies.faultHandler.tlsPort`                       | Fault Handler https port                                                 | 6006                                 |
| `configuration.dependencies.faultHandler.httpPort`                      | Fault Handler http port                                                  | 6005                                 |
| `configuration.dependencies.faultHandler.hostname`                      | Fault handler message broker host name                                   | `eric-fh-alarm-handler`              |
| `configuration.dependencies.faultHandler.serviceName`                   | Service name, will be used in Fault indications prefix                   | `eric-adp-nodejs-chassis-service`    |
| `configuration.dependencies.licenseManager.enabled`                     | Whether to enable license manager handler                                | true                                 |
| `configuration.dependencies.licenseManager.tlsPort`                     | Port for tls connection to the license manager server                    | 18326                                |
| `configuration.dependencies.licenseManager.httpPort`                    | Port for http connection to the license manager server                   | 8080                                 |
| `configuration.dependencies.licenseManager.host`                        | License manager server host                                              | eric-lm-combined-server              |
| `configuration.dependencies.licenseManager.productType`                 | Product Type whom licenses are requested for                             | Expert_Analytics                     |
| `configuration.dependencies.licenseManager.licenses`                    | List of licenses, information about which should be checked              |                                      |
| `metrics.enabled`                                                       | Whether to enable metrics collection                                     | `true`                               |
| `ingress.enabled`                                                       | Switch on/off the ingress configuration                                  | `false`                              |
| `ingress.path`                                                          | Set the relative path / context root for the NodeJS Chassis service      | `/adp-node-chassis`                  |
| `ingress.hostname`                                                      | Set the ingress loadbalancer hostname                                    | None                                 |
| `ingress.tls.enabled`                                                   | Switch on/off the ingress TLS                                            | `false`                              |
| `ingress.tls.existingSecret`                                            | Kubernetes secret where certificates are stored.                         | None                                 |
| `global.security.policyBinding.create`                                  | Enable/disable PodSecurityPolicy support                                 | `false`                              |
| `global.security.policyReferenceMap.default-restricted-security-policy` | Optional. The role name which defines the SecurityPolicy.                | `default-restricted-security-policy` |
| `annotations`                                                           | Additional annotations to be appended to the list of annotations         | []                                   |
|                                                                         | of the resource object.                                                  |                                      |
| `affinity.podAntiAffinity`                                              | Pod Anti Affinity mode                                                   | `soft`                               |
| `global.security.tls.enabled`                                           | Optional. If it is true, then the service will serve with enforced https | `false`                              |

**Notes:**

- `service.endpoints.http.tls.enforced` is not supported with 'optional' value currently
- `service.endpoints.http.tls.verifyClientCertificate` is not supported with 'required' value currently
- `configuration.dependencies.logtransformer.tls.enabled` is required if the deployment
  should use TLS towards the Logtransformer. `global.security.tls` does not have effect on that currently.

### Ingress

The default `Ingress` configuration can be used to deploy the service in a namespace and reach it externally
out of the box. A `NetworkPolicy` also configured to enable incoming Ingress traffic toward the service.

Requirements:

To use the rewrite rules `nginx-ingress-controller` version > 0.22.0 is required.
CCD >= 2.12.0 contains a compatible version, however Nginx is deprecated since version 2.12.0.
It will be replaced with Ingress Controller CR Service (ICCR).

Usage:

- set `ingress.enable` to true
- configure `ingress.path` and `ingress.hostname`

### Pod Security Policy

In certain Kubernetes versions the [Pod Security Policies](https://kubernetes.io/docs/concepts/policy/pod-security-policy/)
is enabled, eg. in [RedHat OpenShift](https://docs.openshift.com/container-platform/3.11/admin_guide/manage_scc.html).

> Note: it is disabled in most Kubernetes distributions like CCD.

To fulfill the OpenShift security context requirements a pod shall set the [Security Context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)
properly and bind the Service Accounts to a cluster role which defines the Policies.

NodeJS Chassis Service sets the Security Context of the Pods to use non-root user.

To support Pod Security Policies this microservice has related settings in the `values.yaml`.
If `global.security.policyBinding.create` is set to `true` the Service Account of the Pod is bind to
the relevant ClusterRole. Its name can be defined by the
`global.security.policyReferenceMap.default-restricted-security-policy` property,
but if it is not defined the role name is constructed as the following: `default-restricted-security-policy`.

### TLS Settings

#### REST API of service

The Rest API of the service can be configured to use HTTPS with TLS for incoming connections.
This can be enabled by settings the `global.security.tls.enabled` parameter. SIP-TLS is used to
generate certificates, so it must be installed in the cluster.

The keys and secret are generated with the `eric-sec-key-management` CI chart, and after it is fully
loaded, the `eric-sec-sip-tls` CI chart generates the certificate files, and mounts them into the
backend web-service, so the webserver can read it.

**Notes:**

- `service.endpoints.http.tls.enforced` is not supported with 'optional' value currently
- `service.endpoints.http.tls.verifyClientCertificate` is not supported with 'required' value currently

### Logging Settings

The default logger logs to the console with the defined `logLevel`. Console logging can be
switched separately by the `stdout.enabled` property.

The logs can be send to the ADP Log Transformer service via logshipper sidecar service.
To enable file logging, set `filelog.enabled` to true and also set the logging parameters.
The default config supports sending logs to `eric-log-transformer`.

Logging can be configured under `configuration` part. Log can be sent to stdout and file too.

- `logLevel`: set the logLevel value globally
- `stdout.enabled`: turn on/off console logging
- `filelog.enabled`: turn on/off syslog

Example default config of Log Transformer:

```yaml
configuration:
  logging:
    enabled: true
    defaultLogLevel: info
    serviceName: eric-adp-chassis,
    stdout:
      enabled: true
    filelog:
      enabled: true,
      logDirName: /logs/chassis/,
      logFileName: auditChassis,
      maxSize: 5120,
      maxFiles: 5
    syslog:
      enabled: false,
```

#### Metric collection configuration

Metrics are forwarded on the default application port.
The following part of the `values.yaml` file is used for metrics configuration:

```yaml
metrics:
  enabled: true

configuration:
  dependencies:
    prometheus:
      appName: eric-adp-chassis
```

The endpoint name is `/metrics`.
Responses are returned as plain text in a specific format readable by Prometheus.

If the value of the `metrics.enabled` parameter is set to `false`, the metric system is fully
disabled: no metrics are collected, and the `/metrics` endpoint does not work.

Performance management can also work in TLS mode.
To enable TLS mode, set the value of the `global.security.tls.enabled` parameter to `true`.

## Authentication and Authorization

It is possible to deploy Nodejs chassis service with user management, using the ADP KeyCloak
implementation IAM, and the AuthZ proxy as a sidecar.

- [IAM](https://adp.ericsson.se/marketplace/identity-and-access-management)
- [Authorization Proxy](https://adp.ericsson.se/marketplace/authorization-proxy-oauth2)

### Prerequisites

To deploy the service with this feature, the following steps needs to be done:

- In the CI chart `global.security.tls.enabled`, `eric-data-document-database-iam.enabled`,
  `eric-sec-sip-tls.enabled` and `eric-sec-access-mgmt.enabled`
  has to be set to true, so SIP-TLS will be deployed and will generate the keys for the IAM service.

- In the eric-adp-nodejs-chassis-service chart `global.security.tls.enabled`, `ingress.useContour`,
  `ingress.tls` and `authorizationProxy.enabled` has to be set to true. Nginx ingress won't work,
  Contour has to be used.

### Parameter Configuration

Most of the configuration can be done via helm value parameters. One of this is to set up the FQDNs
for the services. This system uses 3 FQDNs - one for IAM, one for IAM's Authentication Proxy, and one
for Chassis. The IP address can be freely selected from any of the Contour loadbalancer IP
addresses -`<IP>` in the following. Due to DNS resolving problems, one would have to update the systems
hosts file every time to make the redirection working, although there is a workaround for this, called
[nip.io](https://nip.io). This website helps the browser, and resolves addresses via rules that are
described on their website. With the help of this the FQDNs can be the following:

- IAM FQDN located in eric-adp-nodejs-chassis-service values.yaml
  `authorizationProxy.keycloakFQDN`: `iam.<IP>.nip.io`
- AuthN FQDN located in eric-adp-nodejs-chassis-service values.yaml
  `authorizationProxy.authnProxyFQDN`:`authn.<IP>.nip.io`
- eric-adp-nodejs-chassis-service FQDN under ingress settings
  `ingress.hostname`:`chassis.<IP>.nip.io`

The IAM service also has some parameters for these addresses in its config under the CI chart:

- `eric-sec-access-mgmt.authenticationProxy.cookieDomain`: `nip.io`
- `eric-sec-access-mgmt.authenticationProxy.ingress.hostname`: `authn.10.196.123.200.nip.io`
- `eric-sec-access-mgmt.ingress.hostname`: `iam.10.196.123.200.nip.io`

### Deployment

The deployment can be done with Helm install command or Tilt, it is recommended to use Tilt for it's
robustness. With Tilt turn on `ingressEnableTLS` and `ingressEnableTLS` and set

- the `ingressHost` to `<signum>.chassis.10.196.123.200.nip.io`
- the `authzProxy` to `true`
- the `mTLS` to `true`
- the `authnProxyFQDN` to `<signum>.authn.10.196.123.200.nip.io`
- the `keycloakFQDN` to `<signum>.iam.10.196.123.200.nip.io`

in your tilt.options.user.json file.

Deployment steps:

1. Make sure that your helm dependencies are up to date. (Issue `helm dep update` command
   from `charts/ci` folder.)
2. Run `tilt up` from repo root, or deploy using `helm install`.
3. Wait for all pods except chassis service pod come to the ready state (2 green indicators in Tilt).
   Chassis pod won't be ready, until we create the realm in KeyCloak.
4. Visit `https://iam.<IP>.nip.io`, where you can log into the administration console using
   credentials **admin:admin**. Here the following steps needs to be done:
   1. In the top left hover over **Master** and click **Add realm**. Name it `oam` - the value of
      `authorizationProxy.adpIamRealm` in the CI chart values.yaml - then click **Create**.
   2. Now the new realm will be selected, in the left menu click **Users**. In the top right of the table
      click **Add user**. This will be the user which will be used to log into Chassis service. Pick
      a username, then turn on the **Email Verified** switch, then click **Save**.
   3. Now it will redirect to the created users page. Go into the **Credentials** tab, fill in a chosen
      password, turn off the **Temporary** switch, then click **Set password**.
   4. Go to the **Role Mappings** tab, and add the **all-in-one** role which will give the needed permissions
      to this user to use the service. This role is specified under the `auth-proxy-authorizationrules.yaml`.

> **_Note:_** At step 3, IAM might restart 1-2 times during deployment if the cluster if slower at
> that time, just be patient and wait for it to be ready.

### CORS configuration

CORS is not configured in the eric-sec-access-mgmt service httpproxy settings. To fix this the httpproxy
needs to be edited.
List the httpproxies in your namespace.

```bash
kubectl get httpproxy -n <NAMESPACE>
```

Edit the eric-sec-access-mgmt

```bash
kubectl edit httpproxy eric-sec-access-mgmt -n <NAMESPACE>
```

Find the virtualhost in the httpproxy spec and extend it with the cors settings.

```yaml
virtualhost:
  corsPolicy:
    allowCredentials: true
    allowMethods:
      - GET
      - POST
      - OPTIONS
    allowOrigin:
      - '*'
```

After the steps are done Chassis service pod should move forward and get to the ready state. Now
the application can be accessed through the `https://<signum>.chassis.10.196.123.200.nip.io/ui` address,
where you can login with the created username and password.
