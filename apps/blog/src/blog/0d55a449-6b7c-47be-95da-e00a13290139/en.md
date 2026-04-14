---
title: "Translations in a Javascript Monorepo"
description: "A step-by-step guide on implementing translations in a monorepo."
created_at: "2026-04-01T16:37:05.718Z"
---
## Introduction
Any translation logic operates on two values:
- locale
- resources

Locale is the language identifier which can be extracted through different methods,<br>
while resources is the collection of key value pairs which provide the translation values. 

Possible sources of locale value:
- URL pathname
- URL domain
- URL search params
- various client-side storages
- `lang` attribute on `<html>` element 
- various system envionment variables and APIs (on server)
- request headers
- CLI options

Possible environments translation can exist at:
- server
- server page
- client page
- client
- CLI

All of these environments have different limits on how they can retrieve languages and resources,<br>
some of them have to manage several languages across their lifespan.<br>
The tricky part is a sufficiently developed monorepo has to deal with all these environments and has to be structured to accomodate for that.

## Environments

### Server
The difficulty integrating translations varies between super easy to a gigantic pain. But it all depends on the business logic of the server, so we first separate them into two categories: api server and template rendering server.
API server can go as low as not dealing with request-dependent languages at all and instead return discriminated union keys for errors. Thought it will still have to support server messages for cases like logging, but there is generally no need to change language mid-run so it can be set on startup and the resources can be loaded in memory in their entirety.
Template rendering servers are a complete clusterfuck however, since they involve at least 4 different language contexts:
- server
- server page
- client page
- client
It basically includes everything "fun" about integrating translations.

### Page
While technically not a separate environment, due to its hybrid render nature it has to be treated as a separate one from its host environment, if only to keep things manageable.