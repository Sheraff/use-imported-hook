import { 
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
  useState,
  useRef,
  useDebugValue,
} from 'react'

/**
 * @__IMPORTABLE_HOOK__
 */
export default function useTestHook() {
  useEffect(() => {})
  useCallback(() => {})
  useMemo(() => {})
  useLayoutEffect(() => {})
  const a = useState(false)
  const b = useRef({})
  useImperativeHandle(b, () => {})
  useDebugValue('')
}
