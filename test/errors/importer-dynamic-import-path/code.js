import useImportedHook from 'use-imported-hook'

export default function useTestHook() {
	const a = './hook.jsx'
	return useImportedHook(import(a))
}
