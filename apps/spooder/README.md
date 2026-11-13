# Spooky WEB Spider

## Build for Review

1. Clone repo and switch to it:
```sh
git clone https://github.com/GabenGar/todos.git
cd todos
```

2. Create a [pruned output for the extension][1] and switch to it. We are using `npx` beause dependencies are not installed yet and therefore we can't use repo's `turbo`.
```sh
npx turbo prune spooder
cd out
```

3. Install dependencies:
```sh
npm ci
```

4. Build extension:
```sh
npm run build
```

5. The extension archive will be located in `/apps/spooder/dist`.

## Relevant Links

- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name
- https://wiki.whatwg.org/wiki/MetaExtensions
- https://github.com/dvorapa/meta-version
- https://ogp.me
- https://json-ld.org
- https://www.dublincore.org
- https://doc.ohreally.nl/metatag-translator
- https://www.octolytics.com
- https://schema.org
- https://atproto.com
- https://bsky.app
- https://en.wikipedia.org/wiki/Main_Page
- https://jsld.org/

[1]: https://turborepo.dev/docs/reference/prune
