import { useEffect } from "react";
/**
 * @__IMPORTABLE_HOOK__
 */

export default function useTestHook({}, __importableHookAdditionalDependency) {
  useEffect(() => {}, [__importableHookAdditionalDependency]);
  useEffect(() => {}, [__importableHookAdditionalDependency, a]);
  useEffect(() => {}, [__importableHookAdditionalDependency, a, b]);
}
