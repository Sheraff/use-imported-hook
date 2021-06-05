import useImportedHook from 'use-imported-hook'

const a = () => import('./hook.jsx')
	.then(mod => mod)

export default function useTestHook({flag}) {
	return useImportedHook(flag && a())
}
