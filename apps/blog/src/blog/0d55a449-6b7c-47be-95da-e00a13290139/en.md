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

Possible environments translation can exist at:
- server
- server page
- client page
- client
