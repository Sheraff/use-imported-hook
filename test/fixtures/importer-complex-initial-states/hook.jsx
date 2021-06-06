import { useRef, useState } from "react";
/**
 * @__IMPORTABLE_HOOK__
 */

export default function useTestHook() {
  useRef([])
  useRef({})
  useState({
    a: {
      b: [1, 2, {
        d: 1,
        e: 'coucou'
      }]
    },
    c: false,
    'weird-prop': 1
  })
}
