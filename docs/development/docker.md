# Docker image

Docker is used as container technology in Chassis.

## Builder image

To build NodeJS based images and execute NodeJS based commands in CI there is an
[ADP Nodejs Builder image](https://gerrit.ericsson.se/plugins/gitiles/adp-cicd/adp-nodeJs-builder-image/+/master).

The official master branch contains **NodeJS 12**, however Chassis requires **NodeJS 16**
to have the latest vulnerability fixes.

All the tooling Chassis requires for CI tasks could be found in the
[Nodejs LTS branch](https://gerrit.ericsson.se/plugins/gitiles/adp-cicd/adp-nodeJs-builder-image/+/latest-lts):

- Nodejs Latest LTS version
- Build tools for native modules (Node-gyp)
- Browsers: Chrome, Firefox
- Java JDK for Selenium tests
- FOSSA

Docker image URL: `armdocker.rnd.ericsson.se/proj-adp-cicd-drop/adp-nodejs-lts-builder-image:18.14.2-0`

?> It is inner source, so if anything is needed we can create contributions.

## Service image

The service image is built with multiple layers. The _base_ build layer is the ADP Nodejs image,
then the _UI_ and the _Backend_ has its own build layers. Finally there is a _production_ layer,
which uses the common base OS, and copies the files from the previous builder layers:

- nodejs runtime
- ready to run, pre-installed backend project
- production ready ui project bundle

By this the final image contains the necessary files which is required for runtime only.
This layer contains the main CMD for the image which is a simple `npm start` in the backend project.

The image is also optimized for development, by separating buildsteps into several different
steps. In NodeJS projects the dependency installation is separated from the COPY of the source files.
By this the rebuild time is greatly reduced, as dependencies are rarely changed, so that step can
be replayed from docker cache.

### Development

The image can be found at `docker/Dockerfile`.

To build the image manually run the following command from the repository root directory:

```bash
docker build -t adp-nodejs-chassis-service -f docker/Dockerfile .
```

Start the image with specified port:

```bash
docker run -d -p 8080:3000 adp-nodejs-chassis-service
```

The docker run -p parameter is waiting for the specific ports in the following context:
LOCAL_PORT:DOCKER_PORT. The application serves the content on port 3000 by default.

Try out the image manually:

```bash
$ docker run -t -d adp-nodejs-chassis-service bash
<container id>
# this is the id of the started container. USe it the next commands
$ docker exec -it <container id> bash
# An interactive terminal is opened in side the container
bash-4.4$
```

The interactive terminal can be used to check the internals of the image.
When finished, type exit to leave the terminal and remove the container.

```bash
bash-4.4$ exit
exit

$ docker rm --force <container id>
<container id>
```

## Other images

Several other images are used by CI and testing purposes.

### Selenium hub

The Selenium tests are executed in a selenium hub, where the browsers and the selenium runs
in a different container. The pre-compiled image with the hub and the browsers are fetched from the
internal ARM cache of the public docker-hub registry. As it is a full replica of the docker-hub
the version can be freely updated.

- armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/selenium/hub:3.141.59-20210929
- armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/selenium/node-chrome:3.141.59-20210929

### CI

CI steps are mostly executed in docker containers. By this the CI executors don't have to be
preinstalled with the various ci tools, eg. executing ADP design rule checks, or testing the
service in live kubernetes cluster.

To check the used images, open the `ruleset2.0.yaml`.
