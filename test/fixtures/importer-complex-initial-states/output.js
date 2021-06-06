import { useRef, useState } from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  return useImportedHook(
    import("./hook.jsx"),
    undefined,
    undefined,
    [
      [useRef, []],
      [useRef, {}],
      [
        useState,
        {
          a: {
            b: [
              1,
              2,
              {
                d: 1,
                e: "coucou",
              },
            ],
          },
          c: false,
          "weird-prop": 1,
        },
      ],
    ],
    []
  );
}
