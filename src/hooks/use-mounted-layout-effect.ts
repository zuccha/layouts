import { useLayoutEffect, useRef } from "react";

export default function useMountedLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
) {
  const mounted = useRef(false);
  useLayoutEffect(() => {
    if (mounted.current) effect();
    else mounted.current = true;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
