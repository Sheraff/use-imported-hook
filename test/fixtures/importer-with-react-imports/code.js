import { useMemo, useEffect } from 'react'
import useImportedHook from 'use-imported-hook'

export default function useTestHook() {
	useEffect(() => {}, [])
	const a = useMemo(() => {}, [])
	return useImportedHook(import('./hook.jsx'))
}
