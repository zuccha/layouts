import { HStack, type StackProps } from "@chakra-ui/react";
import { useState } from "react";
import LinkIconButton from "./link-icon-button";
import NumberInput from "./number-input";

export type SizeInputProps = StackProps & {
  initialLinked?: boolean;
  onChange: (value: { h: number; w: number }) => void;
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg";
  value: { h: number; w: number };
};

export default function SizeInput({
  initialLinked = true,
  onChange,
  placeholder,
  size,
  value,
  ...rest
}: SizeInputProps) {
  const [linked, setLinked] = useState(initialLinked);

  return (
    <HStack {...rest}>
      <NumberInput
        label="W"
        min={0}
        onValueChange={(w) =>
          linked ?
            onChange({ h: ratio(value.h, w, value.w), w })
          : onChange({ ...value, w })
        }
        placeholder={placeholder ? `${placeholder} width` : "Width"}
        size={size}
        value={value.w}
      />

      <LinkIconButton
        aria-label={linked ? "Unlink" : "Link"}
        linked={linked}
        onClick={setLinked}
        size={size ? getSmallerSize(size) : undefined}
      />

      <NumberInput
        label="H"
        min={0}
        onValueChange={(h) =>
          linked ?
            onChange({ h, w: ratio(value.w, h, value.h) })
          : onChange({ ...value, h })
        }
        placeholder={placeholder ? `${placeholder} height` : "Height"}
        size={size}
        value={value.h}
      />
    </HStack>
  );
}

function ratio(old: number, newR: number, oldR: number): number {
  return oldR === 0 ? 0 : Math.floor(old * (newR / oldR) * 10) / 10;
}

const sizeTiers = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;
type SizeTier = (typeof sizeTiers)[number];

function getSmallerSize(size: SizeTier): SizeTier {
  const index = sizeTiers.indexOf(size);
  return index > 0 ? sizeTiers[index - 1] : size;
}
