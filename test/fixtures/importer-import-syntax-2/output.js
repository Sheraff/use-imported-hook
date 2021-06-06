import { useEffect } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  const a = () => import("./hook.jsx");

  return useImportedHook(a(), undefined, undefined, [], [[useEffect, 0]]);
}
