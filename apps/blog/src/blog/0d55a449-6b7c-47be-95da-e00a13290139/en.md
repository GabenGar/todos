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
While technically not a separate environment, due to its hybrid render nature it has to be treated as a separate one from its host environment, if only to keep things manageable. I.e. if the page throws an error during server render, you most likely need different messages for client and server. Same logic as API server except server render tends to be hidden behind several layers of abstractions on top of bundling, so it gets very not obvious when an error pertains to server or client logic.

## Monorepo setup

### Quick Rundown
It is assumed the monorepo is managed by `turborepo` with `npm` package manager (and therefore its workspace logic), `i18next` as translation management library and `react` as rendering library. Turborepo has a concept of "application" workspaces and "package" ones, the main difference being the application workspaces do not get dependent on. i18next operates mostly on a singleton structure, an instance of which manages translation groups called "namespaces". The objective is to allow managing translations coming from different packages without too much boilerplate and pain. 

### Workspace Structure
Each workspace has to have `translation` folder inside `src` folder where translation files and various library functions reside. It is a good idea to have a subfolder just for translation files, such as `language`, so there won't be any potential locale namespace collision with library files. All translation-specific symbols must be available from `#translation`/`translation` paths, while translation resources must be available at `#translation/*`/`translation/*` paths.<br>
Thus at minimum a workspace must have these values in `package.json`:
```json
{
  "exports": {
    "./translation": "./src/translation/lib/index.ts",
    "./translation/*": "./src/translation/language/*",
  },
  "imports": {
    "#translation": "./src/translation/lib/index.ts",
    "#translation/*": "./src/translation/language/*",
  },
}
```
The `lib` must have at least this file:<br>
`augs.d.ts`
```typescript
import "i18next";
import type translation from "#translation/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      "<workspace_name>": typeof translation;
    };
    enableSelector: "optimize";
  }
}
```
The index file has to export at least one symbol with this signature:
```typescript
interface IFetchTranslationFunction<Locale, ResourceShape> {
  (language: Locale): Promise<ResourceShape>
}
```