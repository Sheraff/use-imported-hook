import useImportedHook from 'use-imported-hook'

function useTestHook() {
	return useImportedHook(import('./hook.jsx'))
}

export default useTestHook
