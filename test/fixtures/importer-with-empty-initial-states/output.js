import { useRef, useState } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  return useImportedHook(
    import("./hook.jsx"),
    undefined,
    undefined,
    [
      [useRef, undefined],
      [useState, undefined],
    ],
    []
  );
}
