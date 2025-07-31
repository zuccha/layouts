import { Span, type SpanProps } from "@chakra-ui/react";
import { Fragment, type ReactNode } from "react";

export type RichTextPattern = {
  regex: RegExp;
  render: (val: ReactNode) => ReactNode;
};

export type RichTextRecProps = {
  patterns: readonly [RichTextPattern, ...RichTextPattern[]];
  text: string;
};

function RichTextRec({ patterns, text }: RichTextRecProps) {
  const [{ regex, render }, ...rest] = patterns;
  const parts = text.split(regex);

  const renderPart = (part: string) =>
    isListWithAtLeastOneItem(rest) ? (
      <RichTextRec patterns={rest} text={part} />
    ) : (
      part
    );

  return parts.map((part, i) => (
    <Fragment key={i}>
      {i & 1 ? render(renderPart(part)) : renderPart(part)}
    </Fragment>
  ));
}

export type RichTextProps = {
  patterns: RichTextPattern[];
  text: string;
} & Omit<SpanProps, "children">;

export default function RichText({ patterns, text, ...rest }: RichTextProps) {
  return (
    <Span {...rest}>
      {isListWithAtLeastOneItem(patterns) ? (
        <RichTextRec patterns={patterns} text={text} />
      ) : (
        text
      )}
    </Span>
  );
}

function isListWithAtLeastOneItem<T>(items: T[]): items is [T, ...T[]] {
  return items.length > 0;
}
