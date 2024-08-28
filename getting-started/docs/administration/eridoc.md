# Eridoc

Documents storage: [Eridoc](https://eridoc.internal.ericsson.com)

Additional links:

[Eridoc tutorial](https://eth-wiki.rnd.ki.sw.ericsson.se/display/CCX/Eridoc+tutorial)

[How to handle documents in EriDoc](https://eth-wiki.rnd.ki.sw.ericsson.se/display/XOTS/How+to+handle+documents+in+EriDoc)

## Overview

For the chassis all documents contains by the next path:
`eridoca/WorkGroups/BDGS PDG EEA/ADP Generic/NodeJS Chassis`

### NodeJS Chassis

Folder id: 0b004cffc943bc2f

Contains next folders:

1. DPI documents
2. Release documents
3. Security documents
4. Test documents

### Structure of the main folder

#### DPI documents

Folder id: 0b004cffc943bc30

Documents:

1. Application Developers Guide.pdf
2. Interface Description.pdf
3. Service User Guide.pdf

#### Release documents

Folder id: 0b004cffc943bc32

Documents:

1. ADP NodeJS Chassis Service PRI #.pdf (# - version. Like example 0.1.0)

#### Security documents

Folder id: 0b004cffc943bc33

Documents:

1. Risk Assessment and Privacy Impact Assessment.docx
2. Secure Coding Report NodeJS Chassis Microservice.docx
3. Vulnerability Analysis Report.docx

#### Test documents

Folder id: 0b004cffc943d431

Documents:

1. Test Report for version #.zip ( # - version. Like example 0.1.0)
2. Test Specification.pdf

## Approve documents

For the release pipeline all documents should be approved and in the eridoc and in the munin/mimer.
For approval of documents munin/mimer visit [Munin_Mimer](/getting-started/docs/administration/munin_mimer.md)
doc.

All documents should be approved except under "Test documents" folder.
If the documents under "Test documents" folder will be approved,
the system will be blocked for generating new documents.
And the system will ask to change VERSION_PREFIX which should be generated
ONLY automatically from the "release pipeline".

1. Right-click on the document and select Lifecycle
2. Select Approve

## Remove documents

1. Right-click on the document and select Delete.
2. Push (Add widget) looks like (+) and add Recycle Bin widget.
3. Remove document from Recycle Bin.

Only the person who deleted document can see this document under "Recycle Bin" menu.

## Revision number

The documents have a revision number which increments every "eridoc-upload" rule calls.
