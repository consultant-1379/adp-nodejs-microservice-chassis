# Docker build

This guideline describes the main steps and considerations of the Docker build which is defined
in the Dockerfile.

## The layered structure

The Docker build is optimized for fast rebuild on code change.\
It uses multiple layers. Each layer corresponds to certain instructions in the Dockerfile.\
The UI and backend projects are built in a separate layer
with the required build tools and dependencies, and then two project builds are copied to the service
layer. The main runtime environment is built with only the necessary runtime dependencies.

### Layer 1 - Builder for Node.js environment

It is a base layer for the GUI and backend builder layers. Node.js and build tools for node-gyp are
installed here.

### Layer 2 - Builder for the UI project

On this layer the builder copies the UI related files and execute its build.

### Layer 3 - Builder for the Node JS Server project

This layer is also optimized for quick rebuild. It Executes `npm install` first, then copies the
source to the folder.

### Layer 4 - Set up the Node JS server

The last layer is the place for the final image, it consists of three separate layers:

1. Common Base OS layer
2. Common Execution environment layer
   - install packages
   - set up runtime user
3. Service layer
   - copy content from builder layers (Node.js runtime, backend, compiled UI)
   - start the backend server

## Considerations
