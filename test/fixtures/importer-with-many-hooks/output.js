import {
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
  useImperativeHandle,
} from "react";
import useImportedHook from "use-imported-hook";
export default function useTestHook() {
  return useImportedHook(import("./hook.jsx"), [
    [useEffect, [null]],
    [useCallback, [null]],
    [useMemo, [null]],
    [useLayoutEffect, [null]],
    [useImperativeHandle, [null]],
  ]);
}
