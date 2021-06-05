import { useEffect } from "react";
import useImportedHook from "use-imported-hook";

function useTestHook() {
  return useImportedHook(import("./hook.jsx"), [[useEffect, [null]]]);
}

export default useTestHook;
