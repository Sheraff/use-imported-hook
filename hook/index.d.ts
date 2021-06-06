
/**
 * @see [readme on GitHub](https://github.com/Sheraff/use-imported-hook#readme)
 * 
 * @template T type of argument value
 * @template U type of returned value
 * @param importPromise
 * @param args argument to pass to function returned by `importPromise`
 * @param defaultReturn what is returned when hook isn't imported yet
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
 * }) {
 *   const [a, b] = useState(false)
 *   useEffect(() => {...}, [depA])
 *   return "`output` when useCustomHook is loaded"
 * }
 * 
 */
declare function useImportedHook<T,U>(
	importPromise: false | Promise<{default: function(T): U}>,
	args: T,
	defaultReturn: U,
): U;

export default useImportedHook;