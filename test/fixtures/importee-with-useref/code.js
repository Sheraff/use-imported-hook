import { 
  useRef
} from 'react'

/**
 * @__IMPORTABLE_HOOK__
 */
export default function useTestHook() {
  const a = useRef('hello')
  const b = useRef(null)
  const c = useRef({})
  const d = useRef([])
  const e = useRef(false)
  const f = useRef(1)
}
