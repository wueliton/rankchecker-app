import { Box, DialogContent, DialogTitle, Typography } from "@mui/material";
import { DialogComponent } from "../../Dialog";
import CancelIcon from "../../Icons/AllIcons/CancelIcon";
import DownloadFileIcon from "../../Icons/AllIcons/DownloadFileIcon";

type ErrorDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleAccept: () => void;
};

export const ErrorDialog = ({
  open,
  handleAccept,
  handleClose,
}: ErrorDialogProps) => {
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
      <DialogTitle sx={{ textAlign: "center" }}>
        Houve um erro ao tentar Ranquear as palavras chave.
      </DialogTitle>
      <DialogContent>
        <Typography mb={2}>Por favor, tente novamente mais tarde.</Typography>
      </DialogContent>
    </DialogComponent>
  );
};
