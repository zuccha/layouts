import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type FormDialogButtonProps = {
  button: ReactNode;
  children: ReactNode;
  confirmText: string;
  disabled?: boolean;
  onConfirm: () => boolean | void;
  title: string;
};

export default function FormDialogButton({
  button,
  children,
  confirmText,
  disabled,
  onConfirm,
  title,
}: FormDialogButtonProps) {
  return (
    <Dialog.Root
      closeOnEscape={!disabled}
      closeOnInteractOutside={!disabled}
      placement="center"
    >
      <Dialog.Trigger asChild>{button}</Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>{children}</Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button disabled={disabled} variant="outline">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Dialog.Context>
                {(context) => (
                  <Button
                    disabled={disabled}
                    onClick={() => {
                      if (onConfirm()) context.setOpen(false);
                    }}
                  >
                    {confirmText}
                  </Button>
                )}
              </Dialog.Context>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton disabled={disabled} size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
