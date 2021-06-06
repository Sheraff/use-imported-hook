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
 * 
 * @typedef {Array<*> & { 0: NativeHookStateful, 1: any, length: 2 }} SlotStatefulHook
 * @typedef {Array<*> & { 0: NativeHookWithDependencies, 1: Number, length: 2 }} SlotDependenciesHook
 * @typedef {Array<*> & { 0: NativeHookOther, length: 1 }} SlotOtherHook
 */

/**
 * @template T argument
 * @template U return
 * @callback Hook
 * @param {T} args 
 * @param {string} extraDependency
 * @returns {U}
 */

/**
 * @template T argument
 * @template U return
 * @param {false | Promise<{default: Hook<T,U>}>} importPromise
 * @param {T} args
 * @param {U} defaultReturn
 * @param {Array<SlotStatefulHook>} statefulSlots
 * @param {Array<SlotDependenciesHook | SlotOtherHook>} statelessSlots
 * @returns {U}
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
	const importedHook = useRef(/** @type {Hook<args,defaultReturn>} */(null))
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
