# Munin and Mimer

These two systems are closely coupled, almost a single application.
They are accessible at [Mimer](https://mimer.internal.ericsson.com/home) and [Munin](https://munin.internal.ericsson.com/products),
but both UI-s work over the "Munin database".

The term "Mimer" used in this document also includes Munin, unless noted.

At the core of the Mimer solution for PLM-S is Munin -
a scalable information management system for software products.

Mimer/Munin uses objects to represent our artifacts and defines relationships between them.
An object can be the helm chart of the microservice, the image, the source code,
all the related documents, the 3pps, and the abstract product on the top,
that holds all of it together.
It also lets us define relationships between these objects,
which will be used when creating reports and queries.

Together they are used for registering the product structure of MicroServices
which are used to build Ericsson Cloud Native products.
It is the µS dev team's responsibility to maintain Munin data, for each release of the µS.
(This also applies to ADP components, all of which will be soon included into Munin).

## Overview

### Information about Microservices and Product numbers

[EEA 4 Microservices to Mimer/Munin Migration Plans and Status](https://eteamspace.internal.ericsson.com/pages/viewpage.action?pageId=658721975)

### Products

For the Chassis we have the next products:

| Product number | Designation                          | Description                               |
| -------------- | ------------------------------------ | ----------------------------------------- |
| **APR2010333** | ADP NodeJS Chassis Service           | A test product for DG EEA                 |
| **CXD101203**  | ADP Nodejs Chassis Helm              | Helm to ADP Nodejs Chassis (APR 201 0333) |
| **CXU1011172** | ADP Nodejs Chassis Image             | Image to ADP Nodejs Chassis (APR2010333)  |
| **CAV1010075** | ADP NodeJS Chassis Service Source    | Source to ADP NodeJS Chassis Service      |
| **CAF101171**  | ADP NodeJS Chassis Service Interface | Interface to ADP NodeJS Chassis Service   |

### Approve products

For the release pipeline all documents should be approved and in the Eridoc and in the Munin/Mimer.
For approval of documents in the Eridoc visit [Eridoc](/getting-started/docs/administration/eridoc.md)
document.

> To create a Mimer release we must ask
>
> > Rolf Nilsson : rolf.nilsson@ericsson.com - Trade Compliance Team
>
> to approve the following products:
>
> [ADP NodeJS Chassis Service / APR2010333](https://mimer.internal.ericsson.com/exportControlPage?activeView=exportControlClassification&productNumber=APR2010333&productVersion=0.1.0)
>
> [ADP NodeJS Chassis Service Source / CAV1010075](https://mimer.internal.ericsson.com/exportControlPage?activeView=exportControlClassification&productNumber=CAV1010075&productVersion=0.1.0)
>
> [ADP NodeJS Chassis Service Interface / CAF101171](https://mimer.internal.ericsson.com/exportControlPage?activeView=exportControlClassification&productNumber=CAF101171&productVersion=0.1.0)
>
> and
>
> > Tibor Harcsa : tibor.harcsa@ericsson.com
>
> to approve these documents and all other documents from his side.

If you go to the Mimer and enter the desired product in the "Search product" field.
You will see the product found. Point to Description section and select "Compliance Dashboard".

You will see next sections:

1. FOSS usage approved. (Tibor Harcsa should approve it)
2. Encryption check. (Tibor Harcsa should approve it)
3. Trade Compliance check (Rolf Nilsson should approve it)
4. Product restriction check (Tibor Harcsa should approve it)

### Product version

The "productVersion" in the end of the links should be the latest. Like example productVersion=0.3.0.
