const BABEL_MARKER_COMMENT = '@__IMPORTABLE_HOOK__'
const EXTRA_DEPENDENCY_IDENTIFIER_NAME = '__importableHookAdditionalDependency'
const INITIAL_STATES_IDENTIFIER_NAME = '__importableHookInitialStates'

const ACCEPTED_HOOKS = [
	'useCallback',
	'useEffect',
	'useMemo',
	'useLayoutEffect',
	'useImperativeHandle',
]

const HOOKS_WITHOUT_DEPS = [
	'useDebugValue',
]

const STATEFUL_HOOKS = [
	'useState',
	'useRef',
]

const FORBIDDEN_HOOKS = [
	'useContext',
	'useReducer',
]

const NO_MARKER_ERROR = `
hooks imported w/ "useImportedHook" should be marked as such w/ ${BABEL_MARKER_COMMENT} as a leading comment before export default declaration: 
  \`\`\` jsx
  /* ${BABEL_MARKER_COMMENT} */
  function myImportableHook() {}
  \`\`\``

const SINGLE_ARGUMENT_ERROR = `
to make custom hook importable, hook function should have a single argument: 
  ✅function useHook({a, b}) {...}
  ❌function useHook(a, b) {...}`

const ARRAY_LITERAL_ERROR = `
to make custom hook importable, dependencies should be an array literal: 
  ✅useEffect(() => {}, [a, b, c])
  ❌useEffect(() => {}, myArray)`

const SPREAD_OPERATOR_ERROR = `
to make custom hook importable, dependencies shouldn't include any spread element: 
  ✅useEffect(() => {}, [a, b, c])
  ❌useEffect(() => {}, [a, ...myArray])`

const FORBIDDEN_HOOK_ERROR = `cannot use stateful hooks in importable custom hook`

const TOO_MANY_IMPORTS = 'too many `import()` call expressions in single "useImportedHook" call'

const NO_IMPORT_STATEMENT = 'could not find `import()` call expression in "useImportedHook" call'

const NO_DYNAMIC_IMPORT_PATH = `
to allow babel to correctly extract built-in hooks from the imported hook, \`import()\` path must be string literal: 
  ✅import('./myHook.jsx')
  ❌import(pathVariable)`

const MULTIPLE_IMPORTS_ERROR = "This plugin currently only supports 1 call to `useImportedHook` per file"

const STATEFUL_HOOKS_NEED_STATIC_INITIAL_STATE = `
to allow babel to correctly extract built-in hooks from the imported hook, stateful hooks should have static initial states:
  ✅useState('hey')
  ❌useState(myVar)`

module.exports = {
	BABEL_MARKER_COMMENT,
	EXTRA_DEPENDENCY_IDENTIFIER_NAME,
	INITIAL_STATES_IDENTIFIER_NAME,
	ACCEPTED_HOOKS,
	HOOKS_WITHOUT_DEPS,
	STATEFUL_HOOKS,
	FORBIDDEN_HOOKS,
	NO_MARKER_ERROR,
	SINGLE_ARGUMENT_ERROR,
	ARRAY_LITERAL_ERROR,
	SPREAD_OPERATOR_ERROR,
	FORBIDDEN_HOOK_ERROR,
	TOO_MANY_IMPORTS,
	NO_IMPORT_STATEMENT,
	NO_DYNAMIC_IMPORT_PATH,
	MULTIPLE_IMPORTS_ERROR,
	STATEFUL_HOOKS_NEED_STATIC_INITIAL_STATE
}
