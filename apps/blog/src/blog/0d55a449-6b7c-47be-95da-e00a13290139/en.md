---
title: "Translations in a Javascript Monorepo"
description: "A step-by-step guide on implementing translations in a monorepo."
version: 1
created_at: "2026-04-01T16:37:05.718Z"
published_at: "2026-09-17T16:53:38.747Z"
edited_at: "2026-09-17T16:53:38.747Z"
---

## Introduction

Any translation logic operates on two values:

- locale
- resources

Locale is the language identifier which can be extracted through different methods, while resources is the collection of key value pairs which provide the translation values.

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

All of these environments have different limits on how they can retrieve languages and resources, some of them have to manage several languages across their lifespan.\
The tricky part is a sufficiently developed monorepo has to deal with all these environments and has to be structured to accomodate for that.

## Environments

### Server

The difficulty integrating translations varies between super easy to a gigantic pain. But it all depends on the business logic of the server, so we first separate them into two categories: api server and template rendering server.
API server can go as low as not dealing with request-dependent languages at all and instead return discriminated union keys for errors. Though it will still have to support server messages for cases like logging, but there is generally no need to change language mid-run so it can be set on startup and the resources can be loaded in memory in their entirety.
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

Each workspace has to have `translation` folder inside `src` folder where translation files and various library functions reside. It is a good idea to have a subfolder just for translation files, such as `language`, so there won't be any potential locale namespace collision with library files. All translation-specific symbols must be available from `#translation`/`translation` paths, while translation resources must be available at `#translation/*`/`translation/*` paths.\
Thus at minimum a workspace must have these values in `package.json`:

```json
{
  "exports": {
    "./translation": "./src/translation/lib/index.ts",
    "./translation/*": "./src/translation/language/*"
  },
  "imports": {
    "#translation": "./src/translation/lib/index.ts",
    "#translation/*": "./src/translation/language/*"
  }
}
```

The `lib` must have at least this file:\
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

This augments translation types for the workspace and allows to typecheck translation logic. For the purpose of the example, english translation is assumed to be the "default" language both in the logic and resource completeness.

The index file has to export at least one symbol with this signature:

```typescript
interface IGetTranslationFunction<Locale, ResourceShape> {
  (language: Locale): Promise<ResourceShape>;
}
```

This way all workspaces have (almost) everything translation-related stored in predictable paths and dependencies can invoke translations of dependants according to their needs.

## `i18next`

Due to abstract setup of monorepo workspaces and singletone nature of `i18next`, none of its plugins are applicable to our situation, due to package workspaces also having their own translation files, which is not easily expressable as a path template string it uses for various configs.
Except for [`i18next-resources-to-backend`][1] which allows to fetch translations in an asynchronous manner, leaving us writing glue code on how to shove it into the end workspace.\
It is assumed package workspaces have a `i18next` namespace with the same name as the workspace, while apps have at least a generic `translation` namespace, so it's obvious which namespaces an app have to fetch in order to translate fully.

So let's start from implementing a callback function for `i18next-resources-to-backend`:

`/src/translation/fetch-translation.ts`

```typescript
import type { ResourceKey } from "i18next";

export async function fetchTranslation(
  language: ILocale,
  namespace: INameSpace,
) {
  let translation: ResourceKey;

  switch (language) {
    case "en": {
      switch (namespace) {
        // for apps
        case "<workspace_name>": {
          translation = await import("#translation/en.json");
          break;
        }

        default: {
          throw new Error(
            `Unknown translation namespace "${namespace satisfies never}"`,
          );
        }
      }
    }

    default: {
      throw new Error(`Unknown language "${language satisfies never}".`);
    }
  }

  return translation;
}
```

It is important to write dynamic imports in this static manner, this way any bundler can statically optimize them for lazy loading and non-bundled apps can load them as is. Any smart trick is either non-portable due to dependency on a specific bundler, such as `require.context()` or opts out of bundler optimizations in case of storing namespace/locale name pairs in the object and then accessing them dynamically.\
It does suck the function has to be expanded manually, hence why it is written in a separate file at least.

Now create actual file implementing `IGetTranslationFunction`:\
`/src/translation/lib.ts`

```typescript
import i18next, { type InitOptions, type Resource } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { fetchTranslation } from "./fetch-translation";

const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGUAGES = ["en"];
const DEFAULT_NAMESPACES = ["translation"];
type ILocale = (typeof SUPPORTED_LANGUAGES)[number];

i18next
  .use(resourcesToBackend(fetchTranslation))
  .on("failedLoading", (_language, _namespace, message) =>
    console.error(message),
  );

const options = {
  supportedLngs: SUPPORTED_LANGUAGES,
  load: "currentOnly",
  ns: DEFAULT_NAMESPACES,
  fallbackLng: DEFAULT_LANGUAGE,
  returnEmptyString: false,
  returnNull: false,
} satisfies InitOptions;

export async function getTranslation(language: ILocale): Promise<Resource> {
  if (!i18next.isInitialized) {
    await i18next.init({ ...options });
  }

  await i18next.changeLanguage(language);
  await i18next.loadNamespaces(DEFAULT_NAMESPACES);

  return i18next.store.data;
}
```
Reexport `getTranslation()` from `/src/translation/lib/index.ts`.

Again, due to singleton nature of `i18next`, we can't write "pure" functions which return some resources according to locale, so it has to manipulate `i18next` object as a side effect.

This is a very basic setup, which gets more complicated according to needs of the end apps, so they will have separate articles.

[1]: https://github.com/8546082/370316758
