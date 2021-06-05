import useImportedHook from 'use-imported-hook'

const a = 1;
const b = 2;
export default function useTestHook() {
	useImportedHook(a && import('./hook.jsx'))
	useImportedHook(b && import('./hook2.jsx'))
}
