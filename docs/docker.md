# Dockerfile for building adp-nodejs-chassis-service

## Overview

The main Dockerfile is responsible to build and package the GUI and backend projects
into one image. The docker build process is layered and optimized for npm projects mainly.

The GUI and backend projects are build with several layers. As they don't depend on each
other Docker can execute the build in parallel.
After each project is built the final runtime image can be assembled. In that image only the necessary
runtime dependencies are installed and some functionalities are disabled.
If there are more security requirements then they can be fulfilled in the runtime image.

For NPM there is another optimization. As npm project dependencies change rarely, the `npm install`
phase can be moved to a separate step. Then the source code is copied to the project and the backend
is ready to use as there is no other optimization there.
For the GUI an extra build step is needed to get the compiled bundle.

By this, the docker layer caching can be used to optimize docker builds locally and in the CI too.
As npm dependencies changed rarely in most cases a dockerbuild can reuse previously built layers and
new builds can skip npm install entirely.

## Usage

The Dockerfile builds the EUI-SDK frontend, and serves it with the Nodejs backend,
by running the 'npm start' script.

### Building the image

Run the following command from the repository root directory:

```bash
docker build -t adp-nodejs-chassis-service -f docker/Dockerfile .
```

### Start the image with specified port

Start the docker image with specifing a port-forward for the backend service: `-p LOCAL_PORT:DOCKER_PORT`

- LOCAL_PORT: where the internal port will be forwarded to
- DOCKER_PORT: the internal port of the backend service (3000)

```bash
docker run -d -p 8080:3000 adp-nodejs-chassis-service
```
