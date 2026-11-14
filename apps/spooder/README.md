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

### Known Validation Problems

- `The Function constructor is eval.`

If the offending segment looks like this:
```javascript
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
```
This is some webpack-specific runtime stuff and we have to use webpack until the `"strict_min_version"` of firefox supports static ESM imports (new-ish bundlers leave them by default) in all possible extension contexts.

- `Unsafe assignment to innerHTML`

if the offending segment looks like this:
```javascript
case "dangerouslySetInnerHTML":
  if (null != value) {
    if ("object" !== typeof value || !("__html" in value))
      throw Error(formatProdErrorMessage(61));
    key = value.__html;
    if (null != key) {
      if (null != props.children) throw Error(formatProdErrorMessage(60));
      (null != prevValue ? prevValue.__html : void 0) !== key &&
        (domElement.innerHTML = key);
    }
  }
  break;
```
Then it's ReactJS implementation of [`dangerouslySetInnerHTML`][2] common prop. The actual attack surface is mentioning of this prop in ReactJS components.

- `Unsafe call to import for argument 0`

If the offending segment looks like this:
```javascript
//#region lib/dom/ssr/routeModules.ts
async function loadRouteModule(route, routeModulesCache) {
	if (route.id in routeModulesCache) return routeModulesCache[route.id];
	try {
		let routeModule = await import(
			/* @vite-ignore */
			/* webpackIgnore: true */
			route.module
);
		routeModulesCache[route.id] = routeModule;
		return routeModule;
	} catch (error) {
		console.error(`Error loading route module \`${route.module}\`, reloading page...`);
		console.error(error);
		if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && /* unsupported import.meta.hot */ undefined) // removed by dead control flow
{}
		window.location.reload();
		return new Promise(() => {});
	}
}
//#endregion
```

Then it's some [React Router][3] stuff, presumably related to lazy route mechanics. In context of extensions React Router is invoked purely client-side. Presumably the set of possible route modules is known at build time and doesn't change at runtime, therefore no 3rd-party values are involved.

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
[2]: https://react.dev/reference/react-dom/components/common#common-props
[3]: https://reactrouter.com
