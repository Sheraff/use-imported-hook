import { useEffect } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook({ flag }) {
  return useImportedHook(flag && import("./hook.jsx"), [[useEffect, [null]]]);
}
