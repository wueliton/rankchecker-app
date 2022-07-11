import { Box, DialogContent, DialogTitle } from "@mui/material";
import { DialogComponent } from "../../Dialog";
import ContinueIcon from "../../Icons/AllIcons/ContinueIcon";

type SearchContinueDialogProps = {
  open: boolean;
  client?: string;
  website?: string;
  keywords?: number;
  handleClose: () => void;
  handleAccept: () => void;
};

export const SearchContinueDialog = ({
  open,
  client,
  keywords,
  website,
  handleAccept,
  handleClose,
}: SearchContinueDialogProps) => {
  return (
    <DialogComponent
      open={open}
      handleClose={handleClose}
      handleAccept={handleAccept}
    >
      <Box sx={{ paddingX: 2, paddingTop: 2, textAlign: "center" }}>
        <ContinueIcon
          sx={{
            height: "80px",
            width: "80px",
            padding: 2,
            backgroundColor: "#3661ED",
            color: "white",
            borderRadius: "24px",
          }}
        />
      </Box>
      <DialogTitle sx={{ textAlign: "center" }}>
        Deseja continuar a busca?
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          Foi localizada uma busca não finalizada no histórico, deseja continuar
          a busca?
        </Box>
        <Box>
          Cliente: <strong>{client}</strong>
        </Box>
        <Box>
          Website: <strong>{website}</strong>
        </Box>
        <Box>
          Palavras Restantes: <strong>{keywords}</strong>
        </Box>
      </DialogContent>
    </DialogComponent>
  );
};
