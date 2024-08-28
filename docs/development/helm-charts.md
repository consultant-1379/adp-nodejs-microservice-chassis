# Helm charts

Helm is the package manager for Kubernetes. It wraps the needed manifests (yaml) files defining the
needs of a microservice in terms of various resources such as Pods, Controllers, Service, etc. into
a pre-configured package.\
Helm is using a packaging format named Chart. A chart is a collection of files that defines the
Kubernetes resources needed to deploy a microservice. All chart files are added into a directory and
the name of that directory will be the name of the chart.\

The general information regarding how to create a helm chart can be found in the [Helm docs](https://helm.sh/docs/).

To create helm charts for services within the ADP ecosystem, ADP provides additional design rules:
[Helm Design Rules and Guidelines](https://confluence.lmera.ericsson.se/display/AA/Helm+Chart+Design+Rules+and+Guidelines)

## Chart elements

A chart contains the following mandatory elements:

- `Chart.yaml`\
  Mandatory file that describes the chart and all dependencies. Name and version of the chart must
  be defined.
- `values.yaml`\
  This file contains all parameters used in the chart and their default values. These default values
  can be overridden when the microservice is deployed.

The `templates` directory contains:

- `YAML-files`\
  Defines the Kubernetes resources to be created.
- `\_helpers.tpl`\
  Templates that are used in the YAML-files.

## Kubernetes resources

### Deployment

A Deployment provides declarative updates for Pods and ReplicaSets. This chart is also used
to set environment variables for the container. Some of these environment variables utilize
the Downward API and are used to feed kubernetes cluster/node specific information into the container,
see for example syslog metadata fields.

For more information about Downward API, see:
`https://kubernetes.io/docs/tasks/inject-data-application/environment-variable-expose-pod-information/`

### ConfigMap

Config-map allows to centrally store configuration data that can be injected at deployment time
(as environment variables or configuration files) and run-time (configuration files).
The `backend-config.json` is a run-time configuration file mounted at deploy time.

### Service

In Kubernetes, a Service is an abstraction which defines a logical set of Pods and a policy by
which to access them.

ClusterIP: default service type which creates a cluster-internal IP address. Clients running within
the cluster can use this IP address to have load-balanced access to the endpoints providing the service.

The UI app service can be accessed on port 3000.

### ServiceAccount

ServiceAccount allows Kubernetes to issue and inject credentials to pods so that they can access the
Kubernetes API server.

Role Based Access Control (RBAC) Kubernetes API server authorizes all operations according to role
of the client.\
Role defines a set of allowed operations and RoleBinding assigns roles to clients.

### Ingress

Ingress is an object that manages external access to services running inside the Kubernetes cluster.
Essentially, it is a collection of rules that allow inbound connections to reach services in the cluster.
It can be configured to give services externally routable URLs, load balance traffic, terminate SSL,
etc. An Ingress Controller (deployed in Pods) has the responsibility to ensure ingress requests are
fulfilled. Nginx is a widely used ingress controller for Kubernetes.

### TLS certificate charts

The charts of `sip-tls-*.yaml` files are required if secure communication via TLS is turned on.
Service Identity Provider TLS is an ADP component, see more information:
`https://adp.ericsson.se/marketplace/service-identity-provider-tls`

Client certificates are provided by the `InternalCertificate` charts, where the `certificate.issuer.reference`
should be set to the primary Certificate Authority (CA) of the given service.
CertificateManager of adp-nodejs-chassis expects that the `kubernetes.certificateName` is set to `cert.pem`
and the `kubernetes.privateKeyName` is set to `key.pem`.
The root Certificate Authority is handled by the chart with `InternalUserCA` kind.

TLS requires certificate files on following volumes and paths,
see their definitions in the Deployment chart, for example:

- root certificate on `root-ca-volume`: `/nodejs-service/server/certificates/root`

## Helm chart parameters

Helm chart configuration options can be found in the [Service Deployment Guide](../release/content/service_deployment_guide.md).

## Node JS specific configuration

### Node JS memory setting

NodeJS memory limit is set automatically from the values.yaml resources memory limit.
