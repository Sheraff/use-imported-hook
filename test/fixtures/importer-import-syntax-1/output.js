import { useEffect } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  return useImportedHook(() => import("./hook.jsx"), [[useEffect, []]]);
}
