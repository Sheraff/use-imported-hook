import {
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
  useState,
  useRef,
  useDebugValue,
} from "react";
/**
 * @__IMPORTABLE_HOOK__
 */

export default function useTestHook(
  {},
  __importableHookStatelessDependency,
  __importableHookStatefulReturns
) {
  useEffect(() => {}, [__importableHookStatelessDependency]);
  useCallback(() => {}, [__importableHookStatelessDependency]);
  useMemo(() => {}, [__importableHookStatelessDependency]);
  useLayoutEffect(() => {}, [__importableHookStatelessDependency]);
  useImperativeHandle(() => {}, [__importableHookStatelessDependency]);
  const a = __importableHookStatefulReturns[0];
  const b = __importableHookStatefulReturns[1];
  useDebugValue("");
}
