# Service User Guide

[TOC]

## Overview

Hello World

### Authentication and Authorization

Authentication and authorization is supported with the
[ADP IAM authentication proxy](https://adp.ericsson.se/marketplace/identity-and-access-management/documentation/8.2.0/dpi/service-user-guide#iam-with-authentication-proxy-k8s-apk8)
and with the
[authorization proxy](https://adp.ericsson.se/marketplace/authorization-proxy-oauth2/documentation/1.5.0/dpi/service-user-guide).
The `authorization proxy` cannot work without the `authentication proxy` because the service stops
in `init` phase without it.
For more information about the configuration of the `authorization proxy`, see
`authorization proxy` Service User Guide.

The following table lists the `authorization proxy` configuration parameters for nodejs chassis service.

| Parameter                               | Description                                                                     | Default Value              |
| --------------------------------------- | ------------------------------------------------------------------------------- | -------------------------- |
| `authorizationProxy.authnProxyFQDN`     | Mandatory. Its value must be the `authentication proxy` FQDN (without protocol) | None                       |
| `authorizationProxy.keycloakFQDN`       | Mandatory. Its value must be the `iam keycloak` FQDN (without protocol)         | None                       |
| `authorizationProxy.authorizationRules` | Roles and resources configuration for the authorization                         | See the `values.yaml` file |

Only users who have `all-in-one-chassis` role can access the UI and the protected resources with the
default value of the `authorizationProxy.authorizationRules` parameter.

By default, authentication and authorization are disabled.
To enable authentication and authorization, set the value of the
`authorizationProxy.enabled` parameter to `true`.

If `authorizationProxy.enabled` is set to `false`, but another (central) solution is applied to
implement authentication and authorization, then the Chassis service UI can also utilize that solution
with the following limitations:

- Resources are not protected, and the login page is not shown by Chassis (it must be realized
  with the central solution).
- User name is displayed if it is stored in a `userName` cookie.
- The logout button works only if the `logoutURL` is set in the Helm configuration and if
  the `userName` cookie exists.

### Scaling and Resilience

#### Scaling

| Scaling Supported (Yes/No) | Minimum Number of Instances | Maximum Number of Recommended Instances |
| -------------------------- | --------------------------- | --------------------------------------- |
| Yes                        | 1 (default is 2)            | N/A                                     |

#### Resilience

#### Pod Disruption Budget

Pod disruption budget is to limit the number of concurrent disruptions that your application experiences,
allowing higher availability while permitting the cluster administrator to manage the clusters nodes.

The Pod disruption budget's `minAvailable` parameter is implemented (default value: 1),
which is a description of the number of Pods in the set that must still be available after the eviction,
even in the absence of the evicted Pod. `minAvailable` can be either an absolute number or a percentage,
it can be configured by setting the `podDisruptionBudget.minAvailable` parameter in the `values.yaml`
file.

You can constrain a Pod so that it is restricted to run on particular node(s), or to prefer to run
on particular nodes. There are several ways to do this and the recommended approaches all use label
selectors to facilitate the selection.

- `nodeSelector`

A `NodeSelector` is the simplest recommended form of node selection constraint. `NodeSelector` is a
field of the `PodSpec`. It specifies a map of key-value pairs. For the Pod to be eligible to run on a
node, the node must have each of the indicated key-value pairs as labels (it can have additional
labels as well). The most common usage is one key-value pair. For further information, see
[Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/)
in the Kubernetes documentation.

`NodeSelector`s can be configured through Helm values by setting `nodeSelector` or `global.nodeSelector`.
The following is an example configuration:

```yaml
nodeSelector:
  disktype: ssd
  region: west
```

- `antiAffinity`

In addition to using replication, a workload SHALL minimize the impact of individual node failures
on its service through a more even distribution of Pods across nodes. This is achieved by ensuring
that it provides inter-pod anti-affinity policy to Kubernetes scheduler in its Helm chart templates.

More info on `antiAffinity` can be found in the Kubernetes [documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).

Pod `antiAffinity` can be set through Helm values. It can be set to "soft" or "hard".
If `antiAffinity` is set to "soft", `antiAffinity` is enforced with a weight of 100. In case of "hard",
`antiAffinity` it is strictly enforced.

- `topologySpreadConstraints`

You can use topology spread constraints to control how Pods are spread across your cluster among
failure-domains such as regions, zones, nodes, and other user-defined topology domains.
This can help to achieve high availability as well as efficient resource utilization.

More info on `topologySpreadConstraints` can be found in the Kubernetes [documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/).

TopologySpreadConstraints can be set through Helm values. An array of `topologyConstraint` objects are
expected where the supported attributes are: `topologyKey`, `maxSkew` and `whenUnsatisfiable`.

```bash
helm install ...
  --set topologySpreadConstraints[0].maxSkew=1
  --set topologySpreadConstraints[0].topologyKey="kubernetes.io/hostname"
  --set topologySpreadConstraints[0].whenUnsatisfiable="DoNotSchedule"
```
