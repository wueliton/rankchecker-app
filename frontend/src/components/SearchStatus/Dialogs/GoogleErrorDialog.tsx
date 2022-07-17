import { Box, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useEffect } from "react";
import Countdown from "react-countdown";
import { DialogComponent } from "../../Dialog";
import CancelIcon from "../../Icons/AllIcons/CancelIcon";

type GoogleDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleAccept: () => void;
};

export const GoogleDialog = ({
  open,
  handleAccept,
  handleClose,
}: GoogleDialogProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      handleAccept();
    }, 1000 * 60 * 20);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DialogComponent
      open={open}
      handleClose={handleClose}
      handleAccept={handleAccept}
    >
      <Box sx={{ paddingX: 2, paddingTop: 2, textAlign: "center" }}>
        <CancelIcon
          sx={{
            height: "80px",
            width: "80px",
            padding: 2,
            backgroundColor: "#ed3636",
            color: "white",
            borderRadius: "24px",
          }}
        />
      </Box>
      <DialogTitle sx={{ textAlign: "center" }}>Erro de recaptcha</DialogTitle>
      <DialogContent>
        <Typography mb={2}>
          O Google bloqueou temporariamente as requisições, você pode tentar
          novamente manualmente ou aguardar o tempo a seguir para que seja
          realizada uma nova tentativa.
        </Typography>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          <Countdown date={Date.now() + 1000 * 60 * 20}></Countdown>
        </Typography>
      </DialogContent>
    </DialogComponent>
  );
};
