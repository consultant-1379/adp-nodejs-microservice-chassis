# Development environment

This section provides information about the suggested development environment.

## Requirements

- NodeJS
  - Use version 14
  - Advised to install nvm (Node Version Manager) to keep up with future version changes
    - [Linux version](https://github.com/nvm-sh/nvm)
    - [Windows version](https://github.com/coreybutler/nvm-windows)
  - Some dependency uses the node-gyp npm package which can compile native addons.
    It requires some build tools to be available, for more info see: [node-gyp](https://github.com/nodejs/node-gyp)
    - Windows: run as Administrator: `npm install --global windows-build-tools`
    - Linux: install python, make, gcc
- Docker and Kubernetes
  - for Windows use [Docker Desktop](https://www.docker.com/products/docker-desktop)
  - for Linux use [minikube](https://github.com/kubernetes/minikube)
- Helm (3.4.0+ is advised)
  - Windows:
    - [install Chocolatey](https://chocolatey.org/install#individual)
    - `choco install kubernetes-helm`
  - On how to install refer to this [page](https://helm.sh/docs/intro/install/)
- Bob
  - mainly required for CI pipeline development <https://gerrit.ericsson.se/plugins/gitiles/adp-cicd/bob>
- Git
  - Source code versioning <https://git-scm.com/>
- For Windows users there is a complete
  [guide](https://eth-wiki.rnd.ki.sw.ericsson.se/pages/viewpage.action?spaceKey=EIT&title=Test+microservice+image+and+chart+in+local+windows+machine+with+BOB)
  on how to set up a docker/k8s development environment.
  _Note:_ this focuses on _Java_ based development

## Repository

The source code is in Git and the code review is done through Gerrit.
For development first time the repository has to be set up properly.

```bash
git clone ssh://<SIGNUM>@gerrit.ericsson.se:29418/EEA/adp-nodejs-microservice-chassis
```

For checking whether the commit message is acceptable according to some message patterns,
there is a script implemented in NodeJS.
After cloning the repo, there is the `git-hooks/commit-msg.d` folder where are two scripts at the moment:

- **gerrit-commit-msg** - this is the default gerrit hook for adding change id to commit messages
- **smi-commit-msg.js** - the new hook to validate the commit message

To use both of these scripts the new git hook (`git-hooks/commit-msg`) simply calls them when triggered.

After running the `install.sh` script, this new commit-msg hook will be enabled so both of the
scripts will be used for the commit messages.

_Note:_ this will override the existing commit-msg hook, which is the gerrit hook by default.

### Gerrit

The Gerrit server is maintained centrally [Gerrit_Central](https://wiki.lmera.ericsson.se/wiki/Gerrit_Central/Home)
Setup steps: [Setup](https://wiki.lmera.ericsson.se/wiki/Gerrit_Central/Setup)

To start working a properly setup account is required, setup an ssh key at:

- <https://gerrit.ericsson.se/#/settings/ssh-keys>

In the cloned repository edit the '.git/config' file as shown for proper push and pull URLs:

```propreties
[remote "origin"]
    url = ssh://<SIGNUM>@gerritmirror.lmera.ericsson.se:29418/EEA/adp-nodejs-microservice-chassis
    pushurl = ssh://<SIGNUM>@gerrit.ericsson.se:29418/EEA/adp-nodejs-microservice-chassis
```

Setup a commit hook for generate change-id:

```bash
gitdir=$(git rev-parse --git-dir); \
  scp -p -P 29418 ${USER}@gerrit.ericsson.se:hooks/commit-msg ${gitdir}/hooks/
```

Common commands:

```bash
git push origin HEAD:refs/for/master  # push commit for review
git commit --amend                    # change commit locally to create a new patchset
```

## IDE

The recommended IDE is [Visual Studio Code](https://code.visualstudio.com/). It is an open source
and free, customizable editor, which provides great tooling for JavaScript based development.

To improve developer experience a common set of VSCode settings and extension recommendation is
committed to the repository. The predefined configuration is in the `.vscode` director in the
repository root. To utilize these open a workspace from the repository root, then accept to install
the recommended extensions. Other settings are automatically used by VSCode.

?> If settings are changed in the `.vscode` folder then a VSCode restart might be needed after
a git pull.

### Docker base development (Coming...)

VSCode supports docker based development,
when the required dependencies and extensions are installed into a docker image.
