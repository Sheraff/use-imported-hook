import useImportedHook from 'use-imported-hook'

function a() {
	return import('./hook.jsx')
		.then(() => import('./hook2.jsx'))
}
export default function useTestHook() {
	useImportedHook(a())
}
