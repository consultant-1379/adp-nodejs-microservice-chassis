# Test specification

## Test levels

Describe the materialization and the test terminology of the test levels in this project at high level.

### Unit testing

A unit test exercises the smallest piece of testable software in the application to determine
whether it behaves as expected. Unit tests are typically written at the class level or around a
small group of related classes. Finally the most important in this level, the unit under test is
isolated from its collaborators.

For the frontend part this project has web-component based EUISDK components as units. Every UI component
and panels are tested as a `@eui/lit-component` unit. On the other hand the UI project has a utility
layer where a relevant part of the business logic can be found. These util javascript modules
contain pure logic without any UI visualization. These are tested per class as a unit.

For the backend part this project has service classes and a kind of static functions without state
as units.

Unit tests are executed during the precodereview (and the drop) pipeline execution for each commit
patchset (and merge).

The used test frameworks/tools to create & run & report tests and results are the followings at this
level:

- `mocha`: Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser,
  making asynchronous testing simple and fun.
- `chai`: Chai is an assertion library, similar to Node's built-in assert.
- `sinon`: Standalone test spies, stubs and mocks for JavaScript.
- `fetchMock`: Mock http requests made using fetch
- `nock`: Mock http requests made using Nodejs requests
- `testdouble`: The right way to mock dependencies in Node.js or webpack environment, that also
  supports stubs.
- `mock-fs`: The mock-fs module allows Node's built-in fs module to be backed temporarily by an
  in-memory, mock file system
- `mochawesome`: Mochawesome is a custom reporter for use with the JavaScript testing framework, mocha.

### Component testing

Unit testing alone doesn't provide guarantees about the behaviour of the system. Up till now we have
good coverage of each of the core modules of the system in isolation. However, there is no coverage
of those modules when they work together. To verify that each module correctly interacts with its
collaborators, more coarse grained testing is required and this is the relevant test level what is
called as component testing in this project.

This microservice has two components: frontend component and the backend
component. In this level a component is started such a way, where all of the classes are
integrated and work together to achieve the required functionality.

The frontend component is UI tested with selenium as a started docker image with a started mock
service.
The backend component is tested as a whole with in-process component test technics, where all the
"adapter" classes are switched with a mock version.

Component tests are executed in the precodereview and the drop pipelines too.

The used test frameworks/tools to create & run & report tests and results are the followings at this
level:

- `mocha`: See the description above
- `wdio`: Next-gen browser and mobile automation test framework for Node.js
- `supertest`: High-level abstraction for testing HTTP, while still allowing you to drop down to the
  lower-level API provided by superagent
- `seleniumgrid`: Selenium Grid is a part of the Selenium Suite that specializes in running multiple
  tests across different browsers, operating systems, and machines in parallel.
- `fetchMock`: Mock http requests made using fetch
- `nock`: Mock http requests made using Nodejs requests
- `testdouble`: See the description above
- `chai`: See the description above

### Integration testing

An integration test verifies the communication paths and interactions between components to detect
interface defects. These tests collect modules together and test them as a subsystem in order
to verify that they collaborate as intended to achieve some larger piece of behaviour.

For the backend in this project this means communication with the discovered APIs and the Kubernetes
API to achieve the required business logic. On the other hand it means communication towards the
generic ADP services too.

For the frontend this means in the Kubernetes cluster it can work together with the backend and the
authentication and authorization generic service as well.

Integration tests are executed during a drop pipeline and the adp application staging pipelines
after each commit is merged in.

The used test frameworks/tools to create & run & report tests and results are the followings at this
level:

- `mocha`: See the description above
- `wdio`: See the description above
- `chai`: See the description above
- `seleniumgrid`: See the description above
- `supertest`: See the description above

## All functional test categories

Describe the test materialization of the functional requirements in high level. High level means
that all requirements are categorized and the following chapters describes the "how is it tested" to
all category. These categories can be called test conditions if you would like to follow the istqb
definitions.

Unit test level is used in all cases, so it is not highlighted every time.

### All UI features testing

Current status: tested

The project has several UI features. On the other hand they are tested in the same way in high level,
so this chapter aggregates them.

#### Description

| Feature               | Description                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| App state is stored   | All application card have more states (eg. favorite, recent state), and they are persisted and showed in the correct lists.          |
| Keyboard navigation   | Starting from the main page the user can navigate and toggle filters by keys.                                                        |
| Search functionality  | Search by tags, description or name. Navigation towards directly to the app or product page from the result list.                    |
| Main page             | Show products as a card list and helps to navigate towards the product pages or the top highlighted (eg. favorites, recent) apps     |
| Expanded app card     | An app card can show their child apps in the same card. Only one deep hierarchy is supported                                         |
| Application grouping  | Application can be grouped by product views at first level, on the other hand can be grouped by alphabetically or app categories too |
| Application filtering | Currently applications can be filtered only by the favorite attribute.                                                               |
| Global navigation     | From the system bar the global navigation panel can be opened, which contains a narrow version of the launcher                       |
