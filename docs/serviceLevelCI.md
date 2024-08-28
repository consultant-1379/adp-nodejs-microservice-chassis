# Service level CI

## Overview

In this NodeJS chassis there is a working example for a CI pipeline.
This example is based on Gerrit, Bob and Jenkins, but it can adapted to other
solutions as well. (eg. Gitlab).

## Bob

Bob is the ADP CICD build tool which helps various tasks related in a tipical
ADP CI pipeline. Main goal is to standardize task execution over different technologies
and in different CI solutions.
For more info: [Bob documentation](https://gerrit.ericsson.se/plugins/gitiles/adp-cicd/bob)

In the Chassis Bob tasks and rules are defined in `ruleset2.0.yaml`.
A bob file typically contains:

- local variables (calculated at runtime)
- properties (project specific constants)
- environment variables (defined in Jenkins)
- docker image references used by tasks
- rules, which can contain a list of tasks and other rules
- tasks, which can execute a simple command natively or in a docker container

Then a bob task or rule can be executed from CLI:

```bash
bob <rulename>
bob <rulename>.<taskname>
```

## Gerrit

Gerrit is the Git codereview tool used in the Chassis. It supports a centralized, per commit review WOW
before merging a commit to a branch into the central git repository. [Gerrit Central](https://gerrit.ericsson.se/)
The Chassis follows a tipical Gerrit Wow:

1. clone the central repository locally
2. init repo by adding a git hook
3. create or update commit in local repo
   a. first create commit normally
   b. if commit has to be changed due to the review, amend commit with the new changes
4. push the commit for review into Gerrit for a given _branch_
   a. for a new commit a new review is created
   b. for amends a new patchset is added to an existing review
   c. _Note:_ the branch is determined by where the commit is pushed. The local branch is irrelevant.
5. Gerrit can execute _Precode-review_ pipelines for each patchset
6. peer developer can review and comment commits manually on Gerrit UI
7. if commit passes both the automatic and manual review it can be merged
8. on merge the _Drop_ pipeline is executed.
   a. _Note:_ if a drop pipeline fails the commit remains merged in the repository.
   it requires a new commit or a revert commit to fix it.
   Until that the further CICD pipelines are blocked.

_Note:_ The Wow above can be customized in various ways, the different Gerrit events
can trigger a set of CI jobs.

## Jenkins

Jenkins is used to define and execute CI pipelines at different stages of the Gerrit review flow.
In Jenkins 2.0 it is possible to define pipelines by external files and the Job fetches the latest
version from git repository.
The pipeline file then calls various Bob tasks or rules in the different stages.
After the execution the pipeline can archive different artifacts, eg. test reports, which can be
accessed from the Jenkins UI.

In the Chassis there are two Jenkins pipeline files:

- `Drop.jenkinsfile` - used after merge to publish artifacts
- `PreCodeReview.jenkinsfile` - used for precode-review

In the Pipeline the steps can be grouped into stages.
In Jenkins UI every stage is shown as a separate column for every job execution. By this it is
easier to spot which stage failed and also to check how long did it take for a stage to run.

### PreCodeReview

The jobs are not created automatically in Jenkins so first manually create a new Job with type _Pipeline_.
Then set the parameters:

- This project is parameterized: String parameter: `GERRIT_REFSPEC`
- Build Triggers - Gerrit event
- Gerrit Trigger:
  - Server: GerritCentral
  - Trigger on: patchset created & draft published
  - Dynamic Trigger Config: set Gerrit project to EEA/adp-nodejs-microservice-chassis
- Pipeline:
  - Definition: pipeline script from SCM
  - SCM: git, set repository url, and set credentials in Jenkins
    - in the advanced section set Refspec to: `$GERRIT_REFSPEC:$GERRIT_REFSPEC`
  - Branch Specifier: `$GERRIT_REFSPEC`
  - Additional behaviour: Clean before checkout
  - Script Path: `ci/PreCodeReview.jenkinsfile` (or the drop file for the drop job)

After save the Job is created and on every codereview the latest pipeline is executed for the patchset.

### Drop

For the drop pipeline create a new Jobs. The previous can be set as template upon the creation.
Then change the following parameters:

- remove `This project is parametrized`
- change Gerrit Trigger: replace previous triggers with `Change Merged`
- change Pipeline / Script Path to: `ci/Drop.jenkinsfile`

## Chassis Pipeline

The Chassis for the pipeline contains typical stages which can be useful for an ADP service
focusing on NodeJS and EUISDK related best practices.
This can be customized depending on the service requirements.

### Prepare stage

- Check if all Bob rules and tasks can be parsed in dry run. If it is skipped a wrong bob descriptor
  may break only in a later stages.
- Clean the workspace. Always be sure that the Job is executed in a clean workspace
  to have deterministic runs.
- Call the related init task from Bob. It is required to initialize Bob variables,
  which are used in later tasks.

### Install dependencies

A standalone stage to install dependencies for the different NPM projects. It is optimized for CI
to speed up installation.

The executed command in each project is `npm ci --prefer-offline --no-audit`.

- npm ci: clean install. Also it install packages based on the package-lock.json only,
  so the result is deterministic.
- preffer-offline: npm cache is used only for fresh downloads (10s), by this the cache is used more
- no-audit: during npm install there is an audit for npm packages. However this audit is not really
  checked during this step. If it is necessary then create a separate stage for it.
- [Speeding up npm install in CI](http://www.tiernok.com/posts/2019/faster-npm-installs-during-ci/)

In the Bob execution the npm cache is mounted to external directory so subsequent execution
can use the cache. For this set the following parameters for the docker execution:

- `--env NPM_CONFIG_CACHE=/tmp/.npm`
- `--volume /tmp:/tmp`

(`/tmp` is the temp directory for the OS used on CI executors)

### Lint

Lint the repository and the projects. These are the advised statics analyzers for JavaScript projects:

- ESLint - the main JavaScript Linter to find bugs, enforce common code style and coding rules
- Markdownlint - for the md files used for internal and marketplace documentation.
  Enforces consistent style rules
- PackageLint - it enforces that .npmrc configurations are respected in package-lock.json.
  This is required for CI as executors usually can't access public internet. A misconfigured devenv however
  can generate package-lock files which pulls npm packages from different repository. (eg. registry.npm.org)

### Generate documentations

This stage is responsible to generate the documentation for the ADP Marketplace.
Can be skipped if the service is only an internal one.
The documentation is looked in the `docs/marketplace` folder.
For more information check the
[Marketplace uploader tool](https://gerrit.ericsson.se/plugins/gitiles/adp-cicd/bob-adp-release-auto/+/refs/heads/master/marketplace/#Marketplace-Uploader)
and the [Document handler tool](https://gerrit.ericsson.se/plugins/gitiles/adp-cicd/bob-adp-release-auto/+/refs/heads/master/marketplace/#Generating-documents).

### Build source

This stage is responsible to execute build for the GUI and Backend projects.
The Bob tasks calls the appropriate npm scripts.
Generally building is only relevant for GUI project where for EUI-SDK there are several build steps

- transpile source code with Babel (for better browser support)
- use Webpack to create minified bundles

The EUI-SDK framework is optimized to handle these bundles.

For NodeJS project these optimizations are not necessary.

- the execution environment depends on the developers (eg. NodeJS version)
- the source can be executed and parsed directly by the runtime engine

### Test source code

In this stage the GUI and Backend related unit and component tests are executed.

### Run selenium test

GUI Selenium based E2E tests. These tests are run on a GUI served by a mock backend,
but in real browsers.

### Build image

Build docker image for the compound service.

### Package

Create the Helm package.

### K8S Test

Run Kubernetes based tests. In this stage the service is deployed to a kubernetes cluster and
various tests can be executed. As these tests are slow try to minimize the test cases run here.

### Publish Docker Image and Helm Chart

In this stage the build, packed artifacts are uploaded to the ARM Artifactory. Also the
development ADP Marketplace documents are published.
By this the Service level CI finishes and the next level pipeliens can test the service further.
