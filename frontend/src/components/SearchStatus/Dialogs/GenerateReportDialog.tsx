import { Box, DialogContent, DialogTitle, Typography } from "@mui/material";
import { DialogComponent } from "../../Dialog";
import DownloadFileIcon from "../../Icons/AllIcons/DownloadFileIcon";

type GenerateReportDialogProps = {
  open: boolean;
  client?: string;
  website?: string;
  keywords?: number;
  handleClose: () => void;
  handleAccept: () => void;
};

export const GenerateReportDialog = ({
  open,
  client,
  website,
  keywords,
  handleAccept,
  handleClose,
}: GenerateReportDialogProps) => {
  return (
    <DialogComponent
      open={open}
      handleClose={handleClose}
      handleAccept={handleAccept}
    >
      <Box sx={{ paddingX: 2, paddingTop: 2, textAlign: "center" }}>
        <DownloadFileIcon
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
      <DialogTitle sx={{ textAlign: "center" }}>Relatório</DialogTitle>
      <DialogContent>
        <Typography mb={2}>
          Seu relatório está pronto, deseja baixar agora?
        </Typography>
        <Typography>
          Cliente: <strong>{client}</strong>
        </Typography>
        <Typography>
          Website: <strong>{website}</strong>
        </Typography>
        <Typography>
          Palavras Ranqueadas: <strong>{keywords}</strong>
        </Typography>
      </DialogContent>
    </DialogComponent>
  );
};
