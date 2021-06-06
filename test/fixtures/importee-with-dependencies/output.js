import { useEffect } from "react";
/**
 * @__IMPORTABLE_HOOK__
 */

export default function useTestHook(
  {},
  __importableHookStatelessDependency,
  __importableHookStatefulReturns
) {
  useEffect(() => {}, [__importableHookStatelessDependency]);
  useEffect(() => {}, [__importableHookStatelessDependency, a]);
  useEffect(() => {}, [__importableHookStatelessDependency, a, b]);
}
