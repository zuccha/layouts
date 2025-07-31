import { Flex, Heading, type StackProps, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type SectionProps = StackProps & {
  actions?: ReactNode;
  children: ReactNode;
  label: string;
};

export default function Section({
  actions,
  children,
  label,
  ...rest
}: SectionProps) {
  return (
    <VStack align="start" gap={0} w="100%" {...rest}>
      <Flex
        align="center"
        borderBottomWidth={1}
        justify="space-between"
        minH="3em"
        px={4}
        w="100%"
      >
        <Heading size="xs" textTransform="uppercase">
          {label}
        </Heading>

        {actions}
      </Flex>

      {children}
    </VStack>
  );
}
