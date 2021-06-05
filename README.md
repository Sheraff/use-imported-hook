# use-imported-hook

## Description

This package allows you to dynamically import any stateless hook in a React component.

```jsx
// useHook.jsx (importer)
import useImportedHook from 'use-imported-hook/hook'

export default function useHook({shouldLoad, ...props}) {
	return useImportedHook(
		shouldLoad && import('./useStatelessHook.jsx'),
		props
	)
}
```
```jsx
// useStatelessHook.jsx (importee)
import { useEffect, useCallback } from 'react'

/* @__IMPORTABLE_HOOK__ */
export default function useStatelessHook({a, b, c}) {
	useEffect(() => {
		// ...
	}, [a, b])

	return useCallback(() => {
		// ...
	}, [c])
}
```

In the example above, `useStatelessHook` will only be loaded *if* `shouldLoad` is true. This allows you to defer the loading of most of your components' logic (everything that isn't needed for the initial render).

## Setup

1. install the package
	```bash
	npm i --save use-imported-hook
	```

2. add the Babel plugin to your config
	```js
	// .babelrc.js
	module.exports = {
		// ...
		plugins: [
			'module:use-imported-hook'
		]
	}
	```

## Syntax for `useImportedHook`

```ts
useImportedHook<T, U>(
	importPromise: false | Promise<{default: function(U): T}>,
	parameters: T?,
	defaultReturn: U?
): U
```

| Argument        | Required | Example
| --------------- | -------- | -------------
| `importPromise` | `true`   | `bool && import('./relative-path.jsx')`
| `parameters`    | `false`  | `{ a, b }`
| `defaultReturn` | `false`  | `""`

<br/>

**Parameters**
- `importPromise` (required)

	can either be *falsy* in which case the hook won't be loaded, or it can be a the *promise* returned by `import()`. By using it in combination with `import()`, webpack is able to package the hook in a separate chunk and to load it on demand.

	❗ The path passed to `import()` must be a relative path for babel to resolve it properly

	```jsx
	❌ useImportedHook(bool && import('/src/hooks/useHook.jsx'))
	```
	```jsx
	❌ useImportedHook(bool && import('@alias/useHook.jsx'))
	```
	```jsx
	✅ useImportedHook(bool && import('./useHook.jsx'))
	```

- `parameters` (optional)

	is optional and will default to `{}`. Do note that it is a single argument, so if you need to pass more than one thing to your hook, you can use `{a, b, c}` or `[a, b, c]`.

- `defaultReturn` (optional)

	The *return* value of `useImportedHook` as long as the hook hasn't loaded yet. 

**Return value**

- Initially, while `importPromise` is either falsy or pending, `useImportedHook` returns `defaultReturn`. 

- Once `importPromise` resolves, `useImportedHook` will always return whatever the imported hook returns *even if* `importPromise` becomes falsy once again.


## Syntax for the imported hook

❗ Because we do static code analysis with a Babel transform plugin to achieve this result, there are a few requirements to keep in mind:

- The function containing all the build-in hooks must be the default export
	```jsx
	❌ function withHooks() {
	❌	useEffect(() => {/*...*/})
	❌ }
	❌ export default function() {
	❌	withHooks()
	❌ }
	```
	```jsx
	✅ function withHooks() {
	✅	useEffect(() => {/*...*/})
	✅ }
	✅ export default withHooks
	```
- The function containing all the build-in hooks must be labeled with a leading comment containing the exact string `@__IMPORTABLE_HOOK__`
	```jsx
	/* @__IMPORTABLE_HOOK__ */
	export default function() {
		useEffect(() => {/*...*/})
	}
	```
- All of your built-in hooks must be in a single function

	```jsx
	❌ function moreStuff() {
	❌	useEffect(() => {
	❌		// ...
	❌	})
	❌ }

	/* @__IMPORTABLE_HOOK__ */
	export default function useStatelessHook() {
	❌	moreStuff()
		return useCallback(() => { /* ... */ })
	}
	```

	```jsx
	/* @__IMPORTABLE_HOOK__ */
	export default function useStatelessHook() {
	✅	useEffect(() => {
	✅		// ...
	✅	})
		return useCallback(() => { /* ... */ })
	}
	```


## Limitations

Currently, only a subset of all built-in Hooks in React are supported *inside* the imported hook:
- ✅ `useEffect`
- ✅ `useCallback`
- ✅ `useMemo`
- ✅ `useLayoutEffect`
- ✅ `useImperativeHandle`
- ✅ `useDebugValue`
- ❌ `useState`
- ❌ `useRef`
- ❌ `useReducer`
- ❌ `useContext`

If your imported hook needs both stateful and stateless built-in hooks, the best approach is to declare the unsupported hooks before `useImportedHook` and pass them as arguments:

```jsx
// useHook.jsx (importer)
import { useRef } from 'react'
import useImportedHook from 'use-imported-hook/hook'

export default function useHook({shouldLoad, ...props}) {
	const a = useRef('hello world')
	useImportedHook(
		shouldLoad && import('./useStatelessHook.jsx'),
		{...props, a}
	)
}
```
```jsx
// useStatelessHook.jsx (importee)
import { useEffect } from 'react'

/* @__IMPORTABLE_HOOK__ */
export default function useStatelessHook({a, b}) {
	useEffect(() => {
		console.log(a.current) // hello world
	}, [a, b])
}
```