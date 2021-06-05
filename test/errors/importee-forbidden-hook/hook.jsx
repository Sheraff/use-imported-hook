import {
  useState,
  useRef,
  useReducer,
  useContext,
  createContext,
} from "react";

const Context = createContext(false)

/**
 * @__IMPORTABLE_HOOK__
 */
export default function useTestHook() {
  const [a, setA] = useState(false);
  const b = useRef(false)
  const [c, dispatchC] = useReducer(() => {}, false)
  const d = useContext(Context)
}
