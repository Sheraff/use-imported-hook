import { useRef, useState } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  return useImportedHook(
    import("./hook.jsx"),
    undefined,
    undefined,
    [
      [useRef, "hello"],
      [useRef, null],
      [useRef, {}],
      [useRef, []],
      [useRef, false],
      [useRef, 1],
      [useState, "hello"],
      [useState, null],
      [useState, {}],
      [useState, []],
      [useState, false],
      [useState, 1],
    ],
    []
  );
}
