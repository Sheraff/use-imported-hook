import useImportedHook from 'use-imported-hook'


const a = import('./hook.jsx')
export default function useTestHook() {
	return useImportedHook(a)
}
