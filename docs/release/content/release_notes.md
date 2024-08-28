# Release Notes

## 0.3.0

Migration:

Features:

- Integrated AuthN/Z Proxy
- UI updated to use EUSDK2

Improvements:

- Update fossa-cli to v3
- Update chassis license manager to use library
- Implemented Vale spell check has been
- NodeJS has been updated to v16.13.0
- Used ESM instead of CommonJS in the backend
- Used CertificateManager for server certificates
- Vulnerability analysis has been implemented
- PRI Eridoc number is calculated automatically
- Node.js has been updated to v18.14.2

Bug-fixes:

- Fixed bookmark creation with new feature

## 0.2.0

Migration:

Features:

- Implemented integration tests

Improvements:

- Updated GUI - Selenium and integration tests use a new HTML test reporter tool.
- Updated selenium tests to be async
- Updated selenium docker compose images
- Added API spec

Bug-fixes:

- Fixed package-lock linting

## 0.1.0

Creating development environment

- Creating Git and Gerrit repository
- CI Pipeline in Bob and Jenkins (PreCodeReview & Drop Pipeline)

Creating Project structure

- GUI (EUI-SDK skeleton application)
- Backend (ExpressJS skeleton application)

Deployment structure

- Package GUI + Backend into one docker image
- Helm chart for deployment

Code Quality assurance introduction

- linting tools (eslint, markdownlint)
- testing frameworks (mocha, selenium)

Development Environment

- adding extensions and config for VSCode (recommended IDE)
- mock services and examples for local development

Documentation

- Development and release docs are added
