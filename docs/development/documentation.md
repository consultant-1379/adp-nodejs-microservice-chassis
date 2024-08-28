# Documentation

The documentation is based on [Markdown](https://www.markdownguide.org/basic-syntax/) format.
Some part of this documentation is published to the [ADP Marketplace](https://adp.ericsson.se/marketplace/nodejs-reference-microservice/documentation/development/dpi/service-user-guide)
, but all of them can be checked with [Gerrit web view](https://gerrit.ericsson.se/plugins/gitiles/EEA/adp-nodejs-microservice-chassis/).
Also the documentation can be started locally with an npm library.

## Docsify

For better user and developer experience the pages can be viewed with [docsify](https://docsify.js.org/).
This is a VueJS based SPA which generates an online documentation from Markdown files.
Currently docsify is configured to include JS and CSS files from external CDN-s, It is suitable for
most developer to check the documentation on their own machine.

It is recommended to install `docsify-cli` globally, which helps initializing and previewing
the website locally.

```bash
npm i docsify-cli -g
```

To preview your site, run the local server with `docsify serve`.
You can preview your site in your browser on `http://localhost:3000`. The files are watched by the server
any changes is instantly visible.

```bash
docsify serve docs
```

The docsify configuration is in the `index.html`. Here you can configure the documentation engine
add new plugins or modify the styles.

!> The `relativePath: true` setting is important as it makes docsify to work similarly
as Gitiles ~and ADP Marketplace docs~. (Marketplace docs does not support relative URLs)

The files starting with `_` are used for navigational and other internal configuration purposes
in docsify. The left side navigation is defined by `_sidebar.md` and it has to be updated manually
if a new file is created. The top navigation is generated from `_navbar.md`.

?> For information and warning block use the !> or ?> tags.

Used plugins:

- Copy-code - adds the copy to clipboard button to every code block
- Darklight-Theme + Themeable - adds a dark-light theme switcher button and a highly customizable theme
- Search - adds a local search feature

**Custom plugin** is written to imitate **Markdown-Include** functionality. This is supported by the
ADP Marketplace, so to have similar rendering it is added to docsify as well.
In short: using the **\{!filename.md!\}** notation md files can be included in other documents.
Useful to make documentation maintainable.

Plugins which could improve docsify experience:

- <https://docsify.js.org/#/awesome?id=plugins>
- <https://mermaid-js.github.io/mermaid/#/README>
- <https://docsify.js.org/#/markdown?id=supports-mermaid>
- <https://jhildenbiddle.github.io/docsify-themeable/#/introduction>
- <https://upupming.site/docsify-katex/docs/#/>

## ADP Marketplace

The documentation for the marketplace is stored under the `docs/marketplace` directory. In the drop pipeline
the \*.md files are converted to HTML, zipped together, uploaded to an ARM repository and then refreshed
on the marketplace.

This directory contains two config files (`marketplace_*.yaml`) for the conversion and for the
upload phases. If the file structure is changed then update these.

For reference check the [Marketplace uploader](https://gerrit.ericsson.se/plugins/gitiles/adp-cicd/bob-adp-release-auto/+/refs/heads/master/marketplace/#Marketplace-Uploader).

!> These documents are uploaded to the ADP Marketplace so please use only supported markdown syntax.
Even if these docs can be visualized by Docsify, don't use special tags like ?> or !>

Check the [Doc handler](https://gerrit.ericsson.se/plugins/gitiles/adp-cicd/bob-adp-release-auto/+/refs/heads/master/marketplace/bin/doc-handler)
for supported features and extensions:

- [Markdown-Include](https://github.com/cmacmackin/markdown-include)
- [TOC](https://python-markdown.github.io/extensions/toc/)
- [SuperFences](https://facelessuser.github.io/pymdown-extensions/extensions/superfences/)
- [Tables](https://python-markdown.github.io/extensions/tables/)

!> Be aware about a limitation in the marketplace link handling, _relative_ links are not working.
To link between documents use absolute URLs, which won't work in Gerrit or docsify unfortunately.

For more information check the [Marketplace Document Handling](https://confluence.lmera.ericsson.se/display/ACD/Marketplace+Document+Handling)
wiki page. This contains the list of _Predefined Documents_, which are the recognized documents.

## Markdown-include Example

An example how to include document fragments into different md files.

1. Create fragment-example.md
2. Add it to the target md file:

```text
# Main title

...

## Subtitle

{!fragment-example.md!}

...
## Other title

```

## Markdown linting with Vale

Vale is a command-line tool that brings code-like linting to prose. See details at [Github](https://github.com/errata-ai/vale/blob/v2/README.md).

Developers are advised to run Vale locally (either via bob (`bob lint:vale`), or after installing Vale
locally) after changing .md files, to keep them tidy.

Vale is ran by the precodereview and Drop pipelines too, and is currently set up to point out
(and fail on) errors only. The custom vocabulary of the project can be expanded as necessary by adding
entries to `docs\styles\Vocab\EEA4_custom_terms\accept.txt`. Keep in mind that entries are case sensitive.

To use Vale with VSCode follow these steps ([Form the docs](https://github.com/errata-ai/vale-vscode#using-vale)):

1. install vale locally\
   Windows: `choco install vale`\
   Linux: `brew install vale`
2. install `errata-ai.vale-server` VSCode extension
3. set `vale.core.useCLI` to `true` in the VSCode settings (already done in the project settings)
4. restart VSCode.

_Note:_ the spellcheck only runs after the markdown file is saved.

## Gerrit - Gitiles

Gerrit thorough the [Gitiles](https://gerrit.googlesource.com/gitiles/) plugin provides a web view
for git repositories. Gitiles automatically renders \*.md Markdown files into HTML for simplified
documentation. By this the repository can be used as a shareable documentation for developers.
For example check the landing page of [Chassis Gerrit repository](https://gerrit.ericsson.se/plugins/gitiles/EEA/adp-nodejs-microservice-chassis/)

Files named `README.md` are automatically displayed below the file's directory listing.

?> `README.md` files are meant to provide orientation for developers browsing the repository,
especially for first-time users.

For reference check [Markdown support in Gitiles](https://gerrit.googlesource.com/gitiles/+/HEAD/Documentation/markdown.md)

## API documentation

API documentation is in the `docs/api` folder. The api documentation is in OpenAPI format in yaml files.
The "examples" section is validated to the api spec during the lint phase of the verify job.
Markdown files are generated from the specs and are committed so they could be viewed in the git webview.

Once the API specs are updated the markdown files can be generated by executing `bob generate-api-specs`
and the generated markdowns must be committed to update the git webview.

The "examples" section can be validated manually by executing `npm run validateExamples` in the `docs/api`
folder.
