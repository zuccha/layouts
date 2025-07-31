import { Box } from "@chakra-ui/react";

export type PreviewGuideProps = {
  color: string;
  scale: number;
  size: { h: number; w: number };
  offset: { x: number; y: number };
};

export default function PreviewGuide({
  color,
  scale,
  size,
  offset,
}: PreviewGuideProps) {
  const border = 3 * scale;

  const guideX1 = offset.x - border;
  const guideX2 = guideX1 + size.w * scale + border;
  const guideY1 = offset.y - border;
  const guideY2 = guideY1 + size.h * scale + border;

  return (
    <>
      <PreviewGuideLine border={border} color={color} x={guideX1} />
      <PreviewGuideLine border={border} color={color} x={guideX2} />
      <PreviewGuideLine border={border} color={color} y={guideY1} />
      <PreviewGuideLine border={border} color={color} y={guideY2} />
    </>
  );
}

export function PreviewGuideLine({
  border,
  color,
  x,
  y,
}: {
  border: number;
  color: string;
  x?: number;
  y?: number;
}) {
  return (
    <Box
      bgColor={color}
      h={x ? "full" : `${border}px`}
      left={x ? `${x}px` : undefined}
      position="absolute"
      top={y ? `${y}px` : undefined}
      w={y ? "full" : `${border}px`}
    />
  );
}
