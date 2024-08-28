# NodeJS Chassis Service

## Overview

...

## Use Cases / Functionalities

...

## Operations & Management

### Configuration Management

#### Helm Configuration

Helm chart parameters can be found in the [Service Deployment Guide](./service_deployment_guide.md).

### Fault Management

Microservice Chassis provides feature of fault indication producing, which will be interpreted into alarms
according to mapping provided and stored.

To enable fault/alarms managing set `configuration.faultIndication.enabled` to true.

Microservice Chassis provides next FI

| FI alias          | Fault name                  | Alarm code | Short description                            |
| ----------------- | --------------------------- | ---------- | -------------------------------------------- |
| SERVICE_ERROR     | service_error               | 15007745   | Generic service/service api error            |
| SERVER_ERROR      | adp_ui_service_server_error | 15007746   | Internal server error                        |
| CERTIFICATE_ERROR | certificate_error           | 15007747   | Error reading certificate files in a cluster |
| K8S_ERROR         | K8S_api_error               | 15007748   | K8S api error, unable to check cluster       |

#### To add Fault Indication/Alarm

1. Edit `faultIndicationDefaultsMap.json`. Add fault indication default config with an alias name as
   a key.
   Required fields:
   - faultName
   - serviceName
   - version
     It is also strongly recommended to add `expiration` field with value > 0.
2. Edit `eric-adp-nodejs-chassis-service-faultmapping.json`. Add an Alarm configuration. `faultName`
   field is required. `code` field is mandatory. Alarms codes could be taken as of sequential to
   existing ones, or obtained using registration process (Minor Type) described in
   `https://erilink.ericsson.se/eridoc/erl/objectId/09004cff86e5863f?docno=1/00021-FCP1305518Uen&action=approved&format=pdf`

#### Using mTLS within Fault management

To enable tls connection between adp-nodejs-microservice-chassis and Fault Handler, settings `global.security.tls.enabled`
and `configuration.dependencies.faultHandler.tls.enabled` should be turned to true. Certificate for the
Fault Handler certificate authority should be mounted to the `/nodejs-service/server/certificates/<serviceName>`

serviceName can be used to obtain `tlsAgent` via `CertificateManager.`

### Performance Management

#### Provided metrics

{! fragments/pm_metrics_fragment.md !}

Requests to the one endpoint with different HTTP methods can be distinguished via labels.

### Logging

At the moment backend-side (node.js) logging is supported only.
Log entries are submitted to the ADP Log Transformer from file via logshipper sidecar.

### Security

#### Authentication

_*Not yet implemented. Authentication will be via IDAM (KeyCloak)*_

#### Authorization

_*Not yet implemented. Authorization will be via IDAM (KeyCloak)*_

#### Certificate Management (TLS)

_*Not yet implemented. Certificate Management for TLS will be via Service Identity Provider TLS*_

#### License Management

Microservice Chassis provides license management which logs information about licenses
for specified product type.

To enable license management set `configuration.licenseManager.enabled` to true.
There will be checked only those licenses, product type of which is specified and
only if the license is defined in the `configuration.licenseManager.licenses` field.
`configuration.licenseManager.licenses` field should contain a list of licenses, every
of which contains `keyId` and 'type' fields.
To change product type need to update the following field `configuration.licenseManager.productType`.

## Interfaces

...

## Architecture

...

### Technology

The GUI web app implemented in E-UISDK framework.

The Backend uses NodeJS.

## Dimensioning

### Parallelism, Scaling, and Resilience Characteristics
