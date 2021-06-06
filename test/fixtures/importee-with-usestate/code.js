import { 
  useState
} from 'react'

/**
 * @__IMPORTABLE_HOOK__
 */
export default function useTestHook() {
  const a = useState('hello')
  const b = useState(null)
  const c = useState({})
  const d = useState([])
  const e = useState(false)
  const f = useState(1)
}
