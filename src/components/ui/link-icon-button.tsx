import { LuLink2, LuUnlink2 } from "react-icons/lu";
import IconButton, { type IconButtonProps } from "./icon-button";

export type LinkIconButtonProps = Omit<IconButtonProps, "Icon" | "onClick"> & {
  label?: string;
  linked: boolean;
  onClick: (linked: boolean) => void;
};

export default function LinkIconButton({
  label,
  linked,
  onClick,
  ...rest
}: LinkIconButtonProps) {
  return (
    <IconButton
      Icon={linked ? LuLink2 : LuUnlink2}
      aria-label={
        label ?
          linked ?
            `Unlink ${label}`
          : `Link ${label}`
        : linked ?
          "Unlink"
        : "Link"
      }
      bgColor={linked ? "bg.muted" : undefined}
      onClick={() => onClick(!linked)}
      variant="outline"
      {...rest}
    />
  );
}
