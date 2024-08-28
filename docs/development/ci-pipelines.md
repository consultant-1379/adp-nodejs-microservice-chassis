# CI Pipelines

The build system of the CI/CD pipeline is Jenkins. The job commands is specified with pipeline scripts.\
The parameters we use for some of our jobs are the helm chart parameters (name, version and repository).\
In the Jenkins jobs, the pipeline scripts are using **Bob** to execute commands.
The pipelines follow the Bob rule naming proposals as described in
[Microservice CI/CD Pipeline](https://confluence.lmera.ericsson.se/pages/viewpage.action?pageId=122564754).

## PreCodeReview pipeline

A short feedback loop to build and test a new change for a developer before code review and merge.
Example: a change usually a new patch change in Gerrit.

## Drop pipeline

When the automatic tests pass and the manual review of the code is done, the change can be merged to
the microservice code base.
Beside running the same scope as PreCodeReview pipeline, Drop pipeline extended with a publish step
to publish artifacts that triggers downstream pipelines (like an application staging).

## CI steps

### Clean

Delete all temporarily created artifacts and directories from the workspace created by previous
pipeline execution

### Init

Initialize variables used by next stages:

- generate version
- generate path to image repository (e.g. ci-internal)
- generate artifacts properties
- cache git hash

### Install dependencies

Installs npm package dependencies in all subprojects.

### Lint

Run static analysis for

- source code (using ESLint)
- helm chart (e.g. helm lint)
- documentation (markdownlint for README files)
- run ADP helm chart design rule validation
- package-lock (_lockfile-lint_ lints the npm package-lock files for security policies)

More info about design rule check:
[Helm Design Rules and Guidelines](https://confluence.lmera.ericsson.se/display/AA/Helm+Chart+Design+Rules+and+Guidelines)

### Generate documentations

This stage generates the documentation for the ADP marketplace from the markdown files.

### Build source code

It calls the build system to build the whole microservice source code.
It currently builds the UI project for validation.

### Test source code

In this stage all unit and component tests of the backend and the UI project are executed.

### Run selenium tests

Runs all Selenium tests in the UI project using a mock-server.
The testing is executed in a Docker container where all Selenium dependencies and WebDrivers are
pre-installed.

### Build Image

In this stage the Docker image is built for the microservice. Image points to an internal registry.\
The Docker image consists of multiple layers.\
The gui and backend project is built in a separate one with the required build tools and dependencies,
and then the main runtime environment is built with only the necessary runtime dependencies.
In the final step the backend server is started.

### Package

In this stage the image design rule check is verified.
It also packages the helm chart and upload it to ci-internal including push images to ci-internal repository.

### K8S test

It executes tests on a kubernetes cluster (currently on the EEA4 presentation cluster).\
The testing focuses on the single microservice (helm install/upgrade works,
test with different configuration options, etc.).

### Publish Docker Image and Helm Chart

> _NOTE:_ Publish is only executed in Drop pipeline

- upload documents to Eridoc
- push docker images to drop registry
- upload helm chart to drop helm repository
