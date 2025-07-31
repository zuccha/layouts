import IconButton, { type IconButtonProps } from "./icon-button";

export type ToggleIconButtonProps = IconButtonProps & {
  active: boolean;
};

export default function ToggleIconButton({
  active,
  ...rest
}: ToggleIconButtonProps) {
  return (
    <IconButton
      borderColor={active ? "border" : undefined}
      variant={active ? "subtle" : "outline"}
      {...rest}
    />
  );
}
