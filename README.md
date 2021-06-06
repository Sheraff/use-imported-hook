# use-imported-hook

[![unit tests](https://github.com/Sheraff/use-imported-hook/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/Sheraff/use-imported-hook/actions/workflows/tests.yml)
![gzipped size](https://badgen.net/badge/gzip/341%20bytes/cyan)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-green)](https://github.com/Sheraff/use-imported-hook/issues)


## Description

This package allows you to dynamically import any hook in a React component!

🎉 Lazy load a component's logic 🎉
```jsx
// MyComponent.jsx (importer)
import useImportedHook from 'use-imported-hook/hook'

export default function MyComponent() {
	const [load, setLoad] = useState(false)
	useImportedHook(
		load && import('./useLazyHook.jsx'),
	)
	return (
		<button onClick={() => setLoad(true)}>
			Click me
		</button>
	)
}
```

🎉 Lazy load a custom hook 🎉
```jsx
// useHook.jsx (importer)
import useImportedHook from 'use-imported-hook/hook'

export default function useHook({load, ...props}) {
	return useImportedHook(
		load && import('./useLazyHook.jsx'),
		props
	)
}
```

🎉 And still write your importable hook like any hook you're used to 🎉
```jsx
// useLazyHook.jsx (importee)
import { useEffect, useCallback, useState } from 'react'

/* @__IMPORTABLE_HOOK__ */
export default function useLazyHook({a, b, c}) {
	const [d, setD] = useState(false)

	useEffect(() => {
		// ...
	}, [a, b])

	return useCallback(() => {
		// ...
	}, [c])
}
```


In the examples above, `useLazyHook` will only be loaded *if* `load` is true. This allows you to defer the loading of most of your components' logic (everything that isn't needed for the initial render).

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
	importPromise: false | Promise<{default: function(T): U}>,
	parameters: T?,
	defaultReturn: U?
): U
```

| Argument        | Required | Example
| --------------- | -------- | -------------
| `importPromise` | `true`   | `bool && import('./path.jsx')`
| `parameters`    | `false`  | `{ a, b }`
| `defaultReturn` | `false`  | `""`

<br/>

**Parameters**
- `importPromise` (required)

	can either be *falsy* in which case the hook won't be loaded, or it can be a the *promise* returned by `import()`. By using it in combination with `import()`, webpack is able to package the hook in a separate chunk and to load it on demand.

	- ❗ The path passed to `import()` must be a relative path for babel to resolve it properly

		[![PRs welcome](https://img.shields.io/badge/PRs-welcome-green)](https://github.com/Sheraff/use-imported-hook/issues/1)

		```jsx
		❌ useImportedHook(bool && import('/src/hooks/useHook.jsx'))
		```
		```jsx
		❌ useImportedHook(bool && import('@alias/useHook.jsx'))
		```
		```jsx
		✅ useImportedHook(bool && import('./useHook.jsx'))
		```
	- ❗ The path passed to `import()` must be a string literal for babel to run a *static code* analysis

		![PRs won't fix](https://img.shields.io/badge/PRs-won't%20fix-red)

		```jsx
		❌ useImportedHook(bool && import(`./${hook}.jsx`))
		```
		```jsx
		✅ useImportedHook(bool && import('./useHook.jsx'))
		```

- `parameters` (optional)

	is optional and will default to `{}`. Do note that it is a single argument, so if you need to pass more than one thing to your hook, you can use `{a, b, c}` or `[a, b, c]`.

- `defaultReturn` (optional)

	The *return* value of `useImportedHook` as long as the hook hasn't loaded yet. 

**Return value**

- While `importPromise` is either falsy or pending, `useImportedHook` returns `defaultReturn`. 

- Once `importPromise` is truthy *and* resolves, `useImportedHook` returns whatever the imported hook returns.

## Syntax for the imported hook

❗ Because we do static code analysis with a Babel transform plugin to achieve this result, there are a few requirements to keep in mind:

- The function containing all the built-in hooks must be the default export
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
- The function containing all the built-in hooks must be labeled with a leading comment containing the exact string `@__IMPORTABLE_HOOK__`
	```jsx
	/* @__IMPORTABLE_HOOK__ */
	export default function() {
		useEffect(() => {/*...*/})
	}
	```
- All of your built-in hooks must be in a single function 
	
	![PRs won't fix](https://img.shields.io/badge/PRs-won't%20fix-red)

	```jsx
	❌ function moreStuff() {
	❌	useEffect(() => {
	❌		// ...
	❌	})
	❌ }

	/* @__IMPORTABLE_HOOK__ */
	export default function useLazyHook() {
	❌	moreStuff()
		return useCallback(() => { /* ... */ })
	}
	```

	```jsx
	/* @__IMPORTABLE_HOOK__ */
	export default function useLazyHook() {
	✅	useEffect(() => {
	✅		// ...
	✅	})
		return useCallback(() => { /* ... */ })
	}
	```
- An imported hook can't contain a call to `useImportedHook`
	
	[![PRs welcome](https://img.shields.io/badge/PRs-welcome-green)](https://github.com/Sheraff/use-imported-hook/issues)

	```jsx
	/* @__IMPORTABLE_HOOK__ */
	export default function useLazyHook() {
	❌	useImportedHook(bool && import('./useOtherHook.jsx'))
		return useCallback(() => { /* ... */ })
	}
	```

- Not all initial values for `useState` and `useRef` can be extracted statically

	[![PRs welcome](https://img.shields.io/badge/PRs-welcome-green)](https://github.com/Sheraff/use-imported-hook/issues/3)
	- Allowed initial values
		- ✅ `true` and `false`
		- ✅ `0`, `1`, `2`... (all integers)
		- ✅ `0.5`, `.1`... (all floats)
		- ✅ `""`, `"hello world"` (all strings)
		- ✅ `{}` (empty object)
		- ✅ `[]` (empty array)
		- ✅ `{a: 1}` (non-empty objects if values are themselves allowed values)
		- ✅ `[0, 1]` (non-empty arrays if items are themselves allowed values)
		- ✅ `!0`, `-1` (unary expressions)
		- ✅ `null`, `undefined`, `NaN`, `Infinity`
	- Forbidden initial values
		- ❌ `myVar` (variable identifiers)
		- ❌ `` `hello ${"world"}` `` (template literals)
		- ❌ `() => {}` (functions and arrow functions)


## Limitation: forbidden built-in hooks
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-green)](https://github.com/Sheraff/use-imported-hook/issues)

Currently, only a subset of all built-in Hooks in React are supported *inside* the imported hook:
- ✅ `useEffect`
- ✅ `useCallback`
- ✅ `useMemo`
- ✅ `useLayoutEffect`
- ✅ `useImperativeHandle`
- ✅ `useDebugValue`
- ✅ `useState`
- ✅ `useRef`
- ❌ `useReducer`
- ❌ `useContext`

If your imported hook needs to use unsupported built-in hooks, the best approach is to declare the unsupported hooks before `useImportedHook` and pass them as arguments:

```jsx
// useHook.jsx (importer)
import { useContext } from 'react'
import useImportedHook from 'use-imported-hook/hook'

export default function useHook({shouldLoad, ...props}) {
	const a = useContext(MyContext)
	useImportedHook(
		shouldLoad && import('./useLazyHook.jsx'),
		{...props, a}
	)
}
```
```jsx
// useLazyHook.jsx (importee)
import { useEffect } from 'react'

/* @__IMPORTABLE_HOOK__ */
export default function useLazyHook({a, b}) {
	useEffect(() => {
		console.log(a) // value of `MyContext` provider
	}, [a, b])
}
```

## Limitation: multiple `useImportedHook` per component 
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-green)](https://github.com/Sheraff/use-imported-hook/issues/2)

Currently, we don't support importing several hooks from within a single component (or hook).

```jsx
export default function MyComponent() {
❌	useImportedHook(a && import('./hook1.jsx'))
❌	useImportedHook(b && import('./hook2.jsx'))
	return <></>
}
```

## Managing Webpack chunks

If you have several components that will load their hooks at the same time, you can give a clue to webpack to package them together in the same chunk:

```jsx
export default function ChatComponent({userLoggedIn}) {
	useImportedHook(userLoggedIn && import(
		/* webpackMode: "lazy-once" */
		/* webpackChunkName: "user-logged-in" */
		'./useChatHook.jsx'),
	)
	return <></>
}
```

```jsx
export default function AccountSettings({userLoggedIn}) {
	useImportedHook(userLoggedIn && import(
		/* webpackMode: "lazy-once" */
		/* webpackChunkName: "user-logged-in" */
		'./useSettingsHook.jsx'),
	)
	return <></>
}
```

In the above example, webpack will put both `useChatHook.jsx` and `useSettingsHook.jsx` in the same .js chunk file.
