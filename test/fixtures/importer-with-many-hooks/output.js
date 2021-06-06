import {
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
  useState,
  useRef,
  useDebugValue,
} from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  return useImportedHook(
    import("./hook.jsx"),
    undefined,
    undefined,
    [
      [useState, false],
      [useRef, {}],
    ],
    [
      [useEffect, 0],
      [useCallback, 0],
      [useMemo, 0],
      [useLayoutEffect, 0],
      [useImperativeHandle, 0],
      [useDebugValue],
    ]
  );
}
