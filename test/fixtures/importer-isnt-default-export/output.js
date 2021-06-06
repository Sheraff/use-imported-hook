import { useEffect } from "react";
import useImportedHook from "use-imported-hook";

function useTestHook() {
  return useImportedHook(
    import("./hook.jsx"),
    undefined,
    undefined,
    [],
    [[useEffect, 0]]
  );
}

export default useTestHook;
