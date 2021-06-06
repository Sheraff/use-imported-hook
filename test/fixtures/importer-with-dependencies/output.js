import { useEffect } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  return useImportedHook(
    import("./hook.jsx"),
    undefined,
    undefined,
    [],
    [
      [useEffect, 0],
      [useEffect, 1],
      [useEffect, 2],
    ]
  );
}
