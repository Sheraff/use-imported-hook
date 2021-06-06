import {
	useRef,
	useState,
	useEffect,
} from 'react'

const STATELESS_HOOKS = [
	'useCallback',
	'useEffect',
	'useMemo',
	'useLayoutEffect',
	'useImperativeHandle',
]

const STATEFUL_HOOKS = [
	'useState',
	'useRef',
]

/**
 * @typedef {React.useEffect | React.useCallback | React.useMemo | React.useLayoutEffect | React.useImperativeHandle} NativeHookWithDependencies
 * @typedef {Array<*> & { 0: NativeHookWithDependencies, 1: React.DependencyList, length: 2 }} Slot
 */

/**
 * this function lazy loads a hook THAT ONLY CONTAINS native
 * react hooks with dependency arrays
 * - useEffect
 * - useCallback
 * - useMemo
 * - useLayoutEffect
 * - useImperativeHandle
 *
 * @example
 * // in Component.jsx
 * const output = useImportedHook(
 *   condition && import("./useCustomHook.jsx"),
 *   [
 *     [useEffect, [depA]],
 *     [useCallback, [depA, depB]]
 *   ],
 *   { depA, depB },
 *   "`output` when useCustomHook is not loaded"
 * );
 *
 * // in useCustomHook.jsx
 * export default function useCustomHook({
 *   depA,
 *   depB
 * }, loaderDependency) {
 *   useEffect(() => {...}, [depA, loaderDependency])
 *   useCallback(() => {...}, [depA, depB, loaderDependency])
 *   return "`output` when useCustomHook is loaded"
 * }
 *
 * @template T what is returned by useImportedHook()
 * @template U
 * @param {false | Promise<{default: function(U, string): T}>} importPromise `condition && import('./file.js')`
 * @param {Slot[]} slots array of tuples [hook, dependencies] that matches exactly the hook in file.js
 * @param {U} args argument to pass to hook imported by useImportedHook()
 * @param {T} defaultReturn what is returned when hook isn't imported yet
 * @returns {T} while file.js is not loaded: defaultReturn, otherwise: file.js default export function return
 *
 */
export default function useImportedHook(
	importPromise,
	slots,
	args,
	defaultReturn
) {
	const [loaded, setLoaded] = useState(false)
	const isLoading = useRef(false)
	const importedHook = useRef(null)
	const isMounted = useRef(true)
	useEffect(() => () => {
		isMounted.current = false
	}, [])

	if (importPromise && !loaded && !isLoading.current) {
		isLoading.current = true
		importPromise.then((module) => {
			if (isMounted.current) {
				importedHook.current = module.default
				console.log('loaded full hook:', module.default.name)
				setLoaded(true)
			}
		})
	}

	const additionalDependency = `${!!importPromise}${loaded}`
	const initialStates = []

	if (!loaded) {
		const empty = () => {}
		slots.forEach(([hook, value]) => {
			if (STATELESS_HOOKS.includes(hook.name)) {
				hook(empty, [additionalDependency, ...new Array(value).fill(null)])
			} else if (STATEFUL_HOOKS.includes(hook.name)) {
				initialStates.push(hook(value))
			} else {
				hook()
			}
		})
		return defaultReturn
	}

	return importedHook.current(args, additionalDependency, initialStates)
}


// {
//   name: "useEffect",
//   value: 0,
// },
// {
//   name: "useCallback",
//   value: 0,
// },