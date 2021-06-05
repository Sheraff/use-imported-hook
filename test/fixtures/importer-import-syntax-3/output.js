import { useEffect } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  const flag = false;

  const a = () => import("./hook.jsx");

  return useImportedHook(flag && a(), [[useEffect, [null]]]);
}
