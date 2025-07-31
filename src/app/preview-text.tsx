import { Box, Span, VStack } from "@chakra-ui/react";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RichText from "../components/ui/rich-text";
import useImageUrl from "../hooks/use-image-url";
import useInterpolatedText from "../hooks/use-interpolated-text";
import type { Data } from "../models/data";
import type { LayoutItemText } from "../models/layout";
import PreviewBox from "./preview-box";

export type PreviewTextProps = {
  data: Data;
  item: LayoutItemText;
};

export default function PreviewText({ data, item }: PreviewTextProps) {
  const [ready, setReady] = useState(false);

  const [fontSize, setFontSize] = useState(item.fontSize);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const alignV = item.alignV;
  const text = useInterpolatedText(item.text, data);

  useLayoutEffect(() => {
    setReady(false);
    setFontSize(item.fontSize);
  }, [item.fontSize, data]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollHeight > container.clientHeight) {
      setFontSize(fontSize - 0.1);
    } else {
      setReady(true);
      if (textContainerRef.current)
        textContainerRef.current.style.marginTop = computeMarginTop(
          alignV,
          container.clientHeight,
          textContainerRef.current.clientHeight,
        );
    }
  }, [alignV, fontSize, data, item]);

  const patterns = useMemo(() => {
    return item.patterns.flatMap((pattern) => {
      try {
        const path = (symbol: string) => `${pattern.symbolPath}/${symbol}.svg`;
        const renderText = (val: ReactNode) =>
          val ? <Span {...pattern.styles}>{val}</Span> : null;
        const renderSymbol = (val: ReactNode) =>
          val ? (
            typeof val === "string" ? (
              <TextSymbol path={path(val)} symbol={val} />
            ) : (
              val
            )
          ) : null;

        const escape = (str: string) =>
          str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const openEscaped = escape(pattern.delimiter.open);
        const closeEscaped = escape(pattern.delimiter.close);
        if (!openEscaped || !closeEscaped) return [];

        const regex =
          pattern.delimiterMode === "include"
            ? new RegExp(`(${openEscaped}.+?${closeEscaped})`)
            : new RegExp(`${openEscaped}(.+?)${closeEscaped}`);

        return [
          {
            regex,
            render: pattern.type === "text" ? renderText : renderSymbol,
          },
        ];
      } catch {
        return [];
      }
    });
  }, [item.patterns]);

  return (
    <PreviewBox item={item}>
      <Box
        color={item.textColor}
        fontFamily={item.fontFamily}
        fontSize={`${fontSize}px`}
        fontStyle={item.fontStyle}
        fontWeight={item.fontWeight}
        h="full"
        lineHeight={item.lineHeight}
        position="absolute"
        ref={containerRef}
        textAlign={item.alignH}
        textTransform={item.textTransform}
        visibility={ready ? "visible" : "hidden"}
        w="full"
      >
        <VStack
          align={alignHToAlignItems[item.alignH]}
          gap={1}
          h="full"
          justify={alignVToJustifyContent[item.alignV]}
          position="absolute"
          ref={textContainerRef}
          w="full"
        >
          {text.split("\n").map((paragraph, i) => (
            <RichText key={i} patterns={patterns} text={paragraph} />
          ))}
        </VStack>
      </Box>
    </PreviewBox>
  );
}

function TextSymbol({ path, symbol }: { path: string; symbol: string }) {
  const url = useImageUrl(path);

  return (
    <Span
      backgroundImage={`url(${url})`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      borderBottom="1px solid black"
      borderRadius="full"
      borderRight="1px solid black"
      boxSize="1em"
      color="transparent"
      display="inline-block"
      height="1em"
      width="1em"
    >
      {symbol}
    </Span>
  );
}

function computeMarginTop(
  alignV: LayoutItemText["alignV"],
  containerHeight: number,
  textHeight: number,
): string {
  switch (alignV) {
    case "top":
      return "0px";
    case "middle":
      return `${containerHeight / 2 - textHeight / 2}px`;
    case "bottom":
      return `${containerHeight - textHeight}px`;
  }
}

const alignHToAlignItems = {
  center: "center",
  left: "flex-start",
  right: "flex-end",
} as const;

const alignVToJustifyContent = {
  bottom: "flex-end",
  middle: "center",
  top: "flex-start",
} as const;
