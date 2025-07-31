import { Flex, Heading, type StackProps, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type SubsectionProps = StackProps & {
  actions?: ReactNode;
  children: ReactNode;
  label: string;
};

export default function Subsection({
  actions,
  children,
  label,
  ...rest
}: SubsectionProps) {
  return (
    <VStack
      align="flex-start"
      borderBottomWidth={1}
      gap={0}
      pb={4}
      w="100%"
      {...rest}
    >
      <Flex align="center" justify="space-between" minH="2.5em" px={4} w="100%">
        <Heading color="fg.muted" size="xs">
          {label}
        </Heading>

        {actions}
      </Flex>

      <VStack align="start" px={4} w="100%">
        {children}
      </VStack>
    </VStack>
  );
}
