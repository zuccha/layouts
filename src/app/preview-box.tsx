import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { selectActiveLayoutSelectedItem } from "../app-store";
import type { LayoutItemBox } from "../models/layout";

export type PreviewBoxProps = {
  children?: ReactNode;
  item: LayoutItemBox;
};

export default function PreviewBox({ children, item }: PreviewBoxProps) {
  if (!item.visible) return null;

  const { bl, br, tl, tr } = item.border.radius;
  const radius = `${tl}px ${tr}px ${bl}px ${br}px`;

  const w = Math.abs(item.x1 - item.x0);
  const h = Math.abs(item.y1 - item.y0);

  return (
    <Box
      bgColor={item.backgroundColor}
      borderColor={item.border.color}
      borderRadius={radius}
      borderWidth={`${item.border.width}px`}
      height={`${h}px`}
      left={`${item.x0}px`}
      onClick={(e) => {
        selectActiveLayoutSelectedItem(item.id);
        e.stopPropagation();
      }}
      overflow="hidden"
      position="absolute"
      top={`${item.y0}px`}
      width={`${w}px`}
    >
      <Box
        bottom={`${item.pb - item.border.width}px`}
        left={`${item.pl - item.border.width}px`}
        position="absolute"
        right={`${item.pr - item.border.width}px`}
        top={`${item.pt - item.border.width}px`}
      >
        {children}
      </Box>
    </Box>
  );
}
