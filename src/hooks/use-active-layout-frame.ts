import { useActiveLayoutBleed, useActiveLayoutSize } from "../app-store";

export default function useActiveLayoutFrame() {
  const bleed = useActiveLayoutBleed();
  const bleedW = bleed.visible ? bleed.w : 0;
  const bleedH = bleed.visible ? bleed.h : 0;

  const layoutSize = useActiveLayoutSize();

  const frameW = layoutSize.w + 2 * bleedW;
  const frameH = layoutSize.h + 2 * bleedH;

  const frameX = -frameW / 2;
  const frameY = -frameH / 2;

  return {
    bleedColor: bleed.color,
    bleedH,
    bleedVisible: bleed.visible,
    bleedW,
    frameH,
    frameW,
    frameX,
    frameY,
    layoutH: layoutSize.h,
    layoutW: layoutSize.w,
  };
}
