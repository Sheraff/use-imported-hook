import { useEffect } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook({ flag }) {
  return useImportedHook(
    flag && import("./hook.jsx"),
    undefined,
    undefined,
    [],
    [[useEffect, 0]]
  );
}
