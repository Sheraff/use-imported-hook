import { 
  useImperativeHandle
} from 'react'

/**
 * @__IMPORTABLE_HOOK__
 */
export default function useTestHook({ ref }) {
  useImperativeHandle(ref, () => {yo: 1})
}
