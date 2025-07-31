import { useCallback, useRef } from "react";

export default function useDrag(
  onDrag: (dx: number, dy: number) => void,
  onDragEnd: (dx: number, dy: number) => void = () => {},
) {
  const posRef = useRef({ x: 0, y: 0 });
  const deltaRef = useRef({ x: 0, y: 0 });

  return useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      posRef.current = { x: e.clientX, y: e.clientY };
      deltaRef.current = { x: 0, y: 0 };

      const onMove = (ev: PointerEvent) => {
        ev.stopPropagation();
        const dx = ev.clientX - posRef.current.x;
        const dy = ev.clientY - posRef.current.y;
        deltaRef.current = { x: dx, y: dy };
        onDrag(dx, dy);
      };

      const onUp = (ev: PointerEvent) => {
        ev.stopPropagation();
        onDragEnd(deltaRef.current.x, deltaRef.current.y);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [onDrag, onDragEnd],
  );
}
