# ADP NodeJS Microservice Chassis

This repository contains the source of a NodeJS microservice chassis, which can be used as an basic
for developing other services in ADP or in Kubernetes.

## Documentation

The documentation is in Markdown format and stored under the `docs` folder.
For a better developer experience use the `docsify` viewer.

[Introduction](/docs/homepage.md)

- Development docs

  - [Dev-Env](/docs/development/dev-env.md)
  - [Build system](/docs/development/build-system.md)
  - [CI/CD](/docs/development/ci-pipelines.md)
  - [Documentation](/docs/development/documentation.md)
  - [Tilt](/docs/development/tilt.md)
  - [Docker build](/docs/development/docker-build.md)
  - [Helm charts](/docs/development/helm-charts.md)
  - [Dependencies](/docs/development/dependencies.md)
  - [Demo backend](/docs/development/demo-backend.md)
  - [Demo GUI](/docs/development/demo-gui.md)
  - [API specs](/docs/api/api-specs.md)
  - [Release manual](/docs/development/release-manual.md)
  - [Release documents](/docs/development/release-documents.md)

- [Release and marketplace docs](/docs/release/README.md)

## Contributing

### Quick start

_Prerequisite:_ NodeJS installed

To check documentation with `docsify`:

```bash
npm i docsify-cli -g
docsify serve docs
```

To install dependencies.

```bash
npm run install:all
```

### Install git hook

In the root folder run the installer script:

```bash
./git-hooks/install.sh
```
