import { Button, type ButtonProps } from "./button";

export type ToggleButtonProps = ButtonProps & {
  active: boolean;
};

export default function ToggleButton({ active, ...rest }: ToggleButtonProps) {
  return (
    <Button
      borderColor={active ? "border" : undefined}
      variant={active ? "subtle" : "outline"}
      {...rest}
    />
  );
}
