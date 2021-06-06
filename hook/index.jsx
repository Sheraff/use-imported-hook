import {
	useRef,
	useState,
	useEffect,
} from 'react'

const empty = () => {}

/**
 * @typedef {React.useState | React.useRef} NativeHookStateful
 * @typedef {React.useEffect | React.useCallback | React.useMemo | React.useLayoutEffect | React.useImperativeHandle} NativeHookWithDependencies
 * @typedef {React.useDebugValue} NativeHookOther

 * @typedef {String | Boolean | Number | void | {} | []} AllowedInitialStates
 * 
 * @typedef {Array<*> & { 0: NativeHookStateful, 1: AllowedInitialStates, length: 2 }} SlotStatefulHook
 * @typedef {Array<*> & { 0: NativeHookWithDependencies, 1: Number, length: 2 }} SlotDependenciesHook
 * @typedef {Array<*> & { 0: NativeHookOther, length: 1 }} SlotOtherHook
 */

/**
 * @see [readme on GitHub](https://github.com/Sheraff/use-imported-hook#readme)
 *
 * @template T what is returned by useImportedHook()
 * @template U
 * @param {false | Promise<{default: function(U, string): T}>} importPromise `condition && import('./file.js')`
 * @param {U} args argument to pass to hook imported by useImportedHook()
 * @param {T} defaultReturn what is returned when hook isn't imported yet
 * @param {Array<SlotStatefulHook>} statefulSlots ignore, generated w/ Babel
 * @param {Array<SlotDependenciesHook | SlotOtherHook>} statelessSlots ignore, generated w/ Babel
 * @returns {T} while file.js is not loaded: defaultReturn, otherwise: file.js default export function return
 *
 * @example
 * // in Component.jsx
 * const output = useImportedHook(
 *   condition && import("./useCustomHook.jsx"),
 *   { depA, depB },
 *   "`output` when useCustomHook is not loaded",
 * );
 *
 * // in useCustomHook.jsx
 * export default function useCustomHook({
 *   depA,
 *   depB
 * }, loaderDependency) {
 *   const [a, b] = useState(false)
 *   useEffect(() => {...}, [depA, loaderDependency])
 *   const ref = useRef(null)
 *   useCallback(() => {...}, [depA, depB, loaderDependency])
 *   useDebugValue('hello')
 *   return "`output` when useCustomHook is loaded"
 * }
 */
 export default function useImportedHook(
	importPromise,
	args,
	defaultReturn,
	statefulSlots,
	statelessSlots,
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

	const initialStates = []
	statefulSlots.forEach(([hook, value]) => {
		initialStates.push(hook(value))
	})

	const additionalDependency = `${!!importPromise}${loaded}`
	if (!loaded || !importPromise) {
		statelessSlots.forEach(([hook, value]) => {
			if (typeof value === 'number') {
				hook(empty, [additionalDependency, ...new Array(value).fill(null)])
			} else {
				hook()
			}
		})
		return defaultReturn
	}

	return importedHook.current(args, additionalDependency, initialStates)
}
