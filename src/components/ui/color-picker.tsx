import {
  ColorPicker as ChakraColorPicker,
  type ColorPickerRootProps as ChakraColorPickerRootProps,
  HStack,
  Portal,
  type PortalProps,
  Text,
  VStack,
  getColorChannels,
  useColorPickerContext,
} from "@chakra-ui/react";
import { useState } from "react";
import useMountedLayoutEffect from "../../hooks/use-mounted-layout-effect";
import { Tooltip } from "./tooltip";

export type ColorPicker_Props = Omit<
  ChakraColorPickerRootProps,
  "onValueChangeEnd"
> & {
  container?: PortalProps["container"];
};

export default function ColorPicker(props: ColorPicker_Props) {
  const { container, onValueChange, value, ...rest } = props;
  const [tempValue, setTempValue] = useState(value);

  useMountedLayoutEffect(() => setTempValue(value), [value]);

  return (
    <ChakraColorPicker.Root
      onValueChange={(e) => setTempValue(e.value)}
      onValueChangeEnd={onValueChange}
      value={tempValue}
      {...rest}
    >
      <ChakraColorPicker.HiddenInput />
      <Tooltip content={props["aria-label"]}>
        <ChakraColorPicker.Control>
          <ChakraColorPicker.Trigger justifyContent="flex-start" w="full">
            <ChakraColorPicker.ValueSwatch />
            <ValueHex />
          </ChakraColorPicker.Trigger>
        </ChakraColorPicker.Control>
      </Tooltip>
      <Portal container={container}>
        <ChakraColorPicker.Positioner>
          <ChakraColorPicker.Content>
            <ChakraColorPicker.Area />
            <HStack>
              <ChakraColorPicker.EyeDropper size="sm" variant="outline" />
              <ChakraColorPicker.Sliders />
            </HStack>
            <VStack align="stretch" gap={1}>
              <ChakraColorPicker.Input />
              <ChannelInputs format="rgba" />
            </VStack>
          </ChakraColorPicker.Content>
        </ChakraColorPicker.Positioner>
      </Portal>
    </ChakraColorPicker.Root>
  );
}

function ChannelInputs(props: { format: ChakraColorPicker.ColorFormat }) {
  const channels = getColorChannels(props.format);
  return (
    <HStack flex="1" gap={1}>
      <Text fontSize="xs" mr={2}>
        {props.format.toUpperCase()}
      </Text>

      {channels.map((channel) => (
        <ChakraColorPicker.ChannelInput
          channel={channel}
          flex={1}
          height="7"
          key={channel}
          px="0"
          textAlign="center"
          textStyle="xs"
        />
      ))}
    </HStack>
  );
}

function ValueHex() {
  const colorPicker = useColorPickerContext();
  const rgba = colorPicker.value.toFormat("rgba");
  const r = toHex(rgba.getChannelValue("red"));
  const g = toHex(rgba.getChannelValue("green"));
  const b = toHex(rgba.getChannelValue("blue"));
  return <Text fontSize="xs">{`#${r}${g}${b}`}</Text>;
}

function toHex(n: number): string {
  const s = n.toString(16);
  return (s.length < 2 ? `0${s}` : s).toUpperCase();
}
