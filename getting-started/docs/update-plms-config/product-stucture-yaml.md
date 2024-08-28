# Product structure yaml

Product structure file includes documents and products.
If the order is changed in this file, then should be changed in the release `ruleset.yaml` too.

## Overview

### Pri-doc-number

For **_PRIDOC_** was implemented "Automatically calculate PRI Eridoc number" logic.
This logic based on the major version of whole system.
It means if we have VERSION_PREFIX like 0.1.0 then major version is 0,
if 10.1.0 then major version is 10.

But we get this value from the `var.version` variable using `regex` and `sed` command
for cutting needed value.
In every init rule (dev, precodereview, drop, release) we are using command bellow:

```bash
- sed -e 's/\..*$//' .bob/var.version > .bob/var.doc-version
```

Example: in the var.version we have a record "0.2.0-h7a148bd.dirty.adpauto".
After using command above, we will have a file var.doc-version with record 0.

The `ruleset2.0.yaml` file has a constant parameter `pri-doc-number`
which is concatenating with generated variable `doc-version` in the `munin:` rule
and the result of this concatenating **_PRIDOC_** inserts into `product_structure.yaml` file.

> Rule: munin:
>
> > Tasks
> >
> > - task: generate-documents-revision-list
> > - task: validate-product-structure
> > - task: create-version
> >
> > Command
> >
> > - --set PRIDOC="${pri-doc-number}/${var.doc-version}"
