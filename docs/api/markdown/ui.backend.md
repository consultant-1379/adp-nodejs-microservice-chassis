---
title: User Interface Simple Backend API Documentation v1.0.0-alpha
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

<h1 id="user-interface-simple-backend-api-documentation">User Interface Simple Backend API Documentation v1.0.0-alpha</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

```
  Ericsson   |   DocNo <DOC NUMBER>   |   Rev PA1   |   Interwork Description
```
# Introduction
This document describes the User Interface Simple Backend REST API.

Base URLs:

* <a href="/api">/api</a>

<h1 id="user-interface-simple-backend-api-documentation-default">Default</h1>

## getTicketList

<a id="opIdgetTicketList"></a>

`GET /tickets`

*Gets all tickets.*

> Example responses

> 200 Response

```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "dateCreated": 0
  }
]
```

<h3 id="getticketlist-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|

<h3 id="getticketlist-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|*anonymous*|[[Ticket](#schematicket)]|false|none|none|
|» id|string|true|none|Unique identification of the ticket.|
|» title|string|true|none|Ticket title.|
|» description|string|true|none|Full description of the task.|
|» dateCreated|integer|true|none|The number of milliseconds elapsed since January 1, 1970.|

<aside class="success">
This operation does not require authentication
</aside>

## createTicket

<a id="opIdcreateTicket"></a>

`POST /ticket`

*Creates a new ticket.*

> Body parameter

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "dateCreated": 0
}
```

<h3 id="createticket-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|object|true|none|
|» id|body|string|false|Unique identification of the ticket.|
|» title|body|string|true|Ticket title.|
|» description|body|string|true|Full description of the task.|
|» dateCreated|body|integer|false|The number of milliseconds elapsed since January 1, 1970.|

> Example responses

> 400 Response

```
"Title or description is incorrect"
```

<h3 id="createticket-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Title or description is incorrect|string|

<aside class="success">
This operation does not require authentication
</aside>

## getTicket

<a id="opIdgetTicket"></a>

`GET /ticket/{id}`

*Gets a ticket by ID.*

<h3 id="getticket-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Ticket ID|

> Example responses

> 200 Response

```json
{
  "id": "TKT-001",
  "title": "Dummy ticket",
  "description": "Ticket for example",
  "dateCreated": 1643886903251
}
```

> 404 Response

```
"Ticket id does not exist"
```

<h3 id="getticket-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Ticket id does not exist|string|

<h3 id="getticket-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» id|string|true|none|Unique identification of the ticket.|
|» title|string|true|none|Ticket title.|
|» description|string|true|none|Full description of the task.|
|» dateCreated|integer|true|none|The number of milliseconds elapsed since January 1, 1970.|

<aside class="success">
This operation does not require authentication
</aside>

## updateTicket

<a id="opIdupdateTicket"></a>

`PUT /ticket/{id}`

*Updates ticket by ID.*

> Body parameter

```json
{
  "title": "string",
  "description": "string",
  "dateCreated": 0
}
```

<h3 id="updateticket-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Ticket ID|
|body|body|object|true|none|
|» title|body|string|false|Ticket title.|
|» description|body|string|false|Full description of the task.|
|» dateCreated|body|integer|false|The number of milliseconds elapsed since January 1, 1970.|

> Example responses

> 400 Response

```
"Title or description is incorrect"
```

<h3 id="updateticket-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Title or description is incorrect|string|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Ticket ID does not exist|string|

<aside class="success">
This operation does not require authentication
</aside>

## deleteTicket

<a id="opIddeleteTicket"></a>

`DELETE /ticket/{id}`

*Removes ticket by ID.*

<h3 id="deleteticket-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Ticket ID|

> Example responses

> 404 Response

```
"Ticket id does not exist"
```

<h3 id="deleteticket-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|None|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Ticket id does not exist|string|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_Ticket">Ticket</h2>
<!-- backwards compatibility -->
<a id="schematicket"></a>
<a id="schema_Ticket"></a>
<a id="tocSticket"></a>
<a id="tocsticket"></a>

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "dateCreated": 0
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|string|true|none|Unique identification of the ticket.|
|title|string|true|none|Ticket title.|
|description|string|true|none|Full description of the task.|
|dateCreated|integer|true|none|The number of milliseconds elapsed since January 1, 1970.|

