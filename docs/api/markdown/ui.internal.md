---
title: User Interface Internal API Documentation v1.0.0-alpha
language_tabs:
  - javascript: JavaScript
language_clients:
  - javascript: ""
toc_footers: []
includes: []
search: false
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="user-interface-internal-api-documentation">User Interface Internal API Documentation v1.0.0-alpha</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

```
  Ericsson   |   DocNo <DOC NUMBER>   |   Rev PA1   |   Interwork Description
```
## Introduction
This document describes the User Interface Internal REST API.

Base URLs:

* <a href="/internal">/internal</a>

<h1 id="user-interface-internal-api-documentation-if-gui-internal-rest">IF.GUI.INTERNAL.REST</h1>

Provides access to static content meant to be used by the User Interface.

## getUiConfig

<a id="opIdgetUiConfig"></a>

`GET /uiConfig`

*API for internal configs*

Endpoint to provide the current ui-config JSON to the UI. The config is constructed from the helm values.

> Example responses

> 200 Response

```json
{
  "logging": {
    "logLevel": "info"
  },
  "routes": {
    "internal": {
      "prefix": "/internal",
      "routes": {
        "config": "/uiConfig"
      }
    },
    "api": {
      "prefix": "/api",
      "routes": {
        "ticket": "/ticket",
        "tickets": "/tickets"
      }
    }
  }
}
```

<h3 id="getuiconfig-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[ui.deployment.config.response](#schemaui.deployment.config.response)|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_ui.deployment.config.response">ui.deployment.config.response</h2>
<!-- backwards compatibility -->
<a id="schemaui.deployment.config.response"></a>
<a id="schema_ui.deployment.config.response"></a>
<a id="tocSui.deployment.config.response"></a>
<a id="tocsui.deployment.config.response"></a>

```json
{
  "logging": {
    "logLevel": "debug"
  },
  "routes": {
    "internal": {
      "prefix": "string",
      "routes": {}
    },
    "api": {
      "prefix": "string",
      "routes": {}
    }
  }
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|logging|object|false|none|Settings for service logging|
|» logLevel|string|false|none|Full name of an UI entity. Well-known name defined during development time|
|routes|object|false|none|Optional definition of custom API routes|
|» internal|object|false|none|The internal API description|
|»» prefix|string|false|none|none|
|»» routes|object|false|none|none|
|» api|object|false|none|The backend simple API description|
|»» prefix|string|false|none|none|
|»» routes|object|false|none|none|

#### Enumerated Values

|Property|Value|
|---|---|
|logLevel|debug|
|logLevel|info|
|logLevel|warning|
|logLevel|error|
|logLevel|critical|

