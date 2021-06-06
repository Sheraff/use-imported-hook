import { 
  useState,
  useRef
} from 'react'

/**
 * @__IMPORTABLE_HOOK__
 */
export default function useTestHook() {
  const a1 = useRef('hello')
  const b1 = useRef(null)
  const c1 = useRef({})
  const d1 = useRef([])
  const e1 = useRef(false)
  const f1 = useRef(1)
  
  const a2 = useState('hello')
  const b2 = useState(null)
  const c2 = useState({})
  const d2 = useState([])
  const e2 = useState(false)
  const f2 = useState(1)
}
