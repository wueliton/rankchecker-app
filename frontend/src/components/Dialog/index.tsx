import { Button, Dialog, DialogActions } from "@mui/material";
import React, { Ref } from "react";

interface DialogComponentProps {
  children: React.ReactElement[];
  open: boolean;
  handleClose: () => void;
  handleAccept: () => void;
}

export const DialogComponent = React.forwardRef(
  (
    { children, open, handleClose, handleAccept }: DialogComponentProps,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <Dialog open={open} ref={ref}>
        {children}
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleAccept} autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
