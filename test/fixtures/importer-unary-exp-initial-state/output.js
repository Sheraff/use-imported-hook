import { useRef, useState } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  return useImportedHook(
    import("./hook.jsx"),
    undefined,
    undefined,
    [
      [useRef, -1],
      [useRef, !0],
      [useState, !-~+[]],
    ],
    []
  );
}
