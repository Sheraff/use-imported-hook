import { useEffect } from 'react'

/**
 * @__IMPORTABLE_HOOK__
 */
export default function useTestHook() {
  useEffect(() => {}, [])
  useEffect(() => {}, [a])
  useEffect(() => {}, [a, b])
}
