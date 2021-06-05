import { useEffect } from "react";
import useImportedHook from "use-imported-hook";
const a = Promise.resolve().then(() => import("./hook.jsx"));
export default function useTestHook({ flag }) {
  return useImportedHook(a, [[useEffect, [null]]]);
}
