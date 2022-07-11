import {
  Box,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService, ApiServiceFiles } from "../../services/ApiService";
import {
  KeywordsSearchState,
  useStorageContext,
} from "../../context/StorageContext";
import { Check, Clear } from "@mui/icons-material";
import fileDownload from "js-file-download";
import { SearchContinueDialog } from "./Dialogs/SearchContinueDialog";
import { GenerateReportDialog } from "./Dialogs/GenerateReportDialog";
import { ErrorDialog } from "./Dialogs/ErrorDialog";
import Countdown from "react-countdown";

export const SearchStatusComponent = () => {
  const [keywordsList, setKeywordsList] = useState<
    KeywordsSearchState["keywordsRanked"]
  >([]);
  const [searchPercent, setSearchPercent] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogDownload, setDialogDownload] = useState(false);
  const [dialogError, setDialogError] = useState(false);
  const navigate = useNavigate();
  const { data, setKeywordsState, addResultToSearchStatus, isNewSearch } =
    useStorageContext();

  const runSearch = async () => {
    if (!data || !data.keywords || !data.client || !data.website) return;
    const restKeywords = [...data.keywords].splice(
      [...(data?.keywordsRanked ?? [])].length
    );
    let hasError = false;

    for (let keyword of restKeywords) {
      try {
        const searchResponse = await ApiService.post("/search", {
          website: data.website,
          client: data.client,
          keyword,
        });

        addResultToSearchStatus(searchResponse.data);
      } catch (err) {
        hasError = true;
        break;
      }
    }

    if (hasError) {
      setDialogError(true);
      const options = {
        body: "Houve um erro com a busca, por favor, tente novamente mais tarde.",
        icon: "/ranchecker.png",
      };

      new Notification("Rankchecker", options);
      return;
    }

    const options = {
      body: "Seu relatório está pronto, abra a janela do RankChecker para baixá-lo agora.",
      icon: "/ranchecker.png",
    };

    new Notification("Rankchecker", options);

    setDialogDownload(true);
  };

  const generateReport = async () => {
    if (!data) return;
    const response = await ApiServiceFiles.post("/generate-excel", {
      website: data.website,
      client: data.client,
      keywords: data.keywordsRanked,
    });
    const date = new Date();

    fileDownload(
      response.data,
      `Reporte ${data.client} - ${date.toLocaleDateString()}.xlsx`
    );
  };

  const cancelSearch = () => {
    setShowDialog(false);
    setKeywordsState(undefined);
    navigate("/");
  };

  const acceptSearch = () => {
    if (!data?.keywords || !data.client || !data.website) return navigate("/");
    setShowDialog(false);
    runSearch();
  };

  const cancellDownloadReport = () => {
    setDialogDownload(false);
    setKeywordsState(undefined);
    navigate("/");
  };

  const downloadReport = () => {
    generateReport();
    setDialogDownload(false);
    setKeywordsState(undefined);
    navigate("/");
  };

  const trySearch = () => {
    setDialogError(false);
    runSearch();
  };

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Esse navegador não suporta notificações.");
    } else {
      Notification.requestPermission();
    }

    updateSearchStatus(data?.keywordsRanked, data?.keywords);
    setSearchPercent(
      () =>
        (100 / (data?.keywords ?? []).length) *
        (data?.keywordsRanked ?? []).length
    );
  }, [data]);

  const updateSearchStatus = (
    keywordsRanked: KeywordsSearchState["keywordsRanked"],
    keywords: KeywordsSearchState["keywords"]
  ) =>
    setKeywordsList((prevState) => {
      if (!keywordsRanked || !keywords) return prevState;
      const lastKeyword = keywords[keywordsRanked.length];

      return [
        ...(!!lastKeyword
          ? [
              {
                keyword: lastKeyword,
                link: "loading",
                page: null,
                position: null,
                title: "loading",
                url: "loading",
              },
            ]
          : []),
        ...keywordsRanked,
      ];
    });

  useEffect(() => {
    if (!data?.keywords || !data.client || !data.website) return navigate("/");
    if (!isNewSearch) {
      if (data.keywords.length - (data.keywordsRanked ?? []).length === 0)
        return setDialogDownload(true);
      const options = {
        body: "Há uma busca não finalizada, abra a janela do RankChecker para continuar.",
        icon: "/ranchecker.png",
      };

      new Notification("Rankchecker", options);
      setShowDialog(true);
      return;
    }
    runSearch();
  }, []);

  return (
    <>
      {showDialog && (
        <SearchContinueDialog
          open={showDialog}
          handleAccept={acceptSearch}
          handleClose={cancelSearch}
          client={data?.client}
          keywords={
            (data?.keywords ?? []).length - (data?.keywordsRanked ?? []).length
          }
          website={data?.website}
        />
      )}
      {dialogDownload && (
        <GenerateReportDialog
          handleAccept={downloadReport}
          handleClose={cancellDownloadReport}
          open={dialogDownload}
          client={data?.client}
          website={data?.website}
          keywords={data?.keywords?.length}
        />
      )}
      {dialogError && (
        <ErrorDialog
          handleAccept={trySearch}
          handleClose={cancelSearch}
          open={dialogError}
        />
      )}
      <h3>Fila de Ranqueamento</h3>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "4px",
            border: "1px solid #F8F9FF",
            width: "100%",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.15)",
            padding: 2,
            marginBottom: 4,
          }}
        >
          <strong>{data?.client}</strong>
          <p>Ranqueando palavras chave...</p>
          <LinearProgress variant="determinate" value={searchPercent} />
          <Typography sx={{ textAlign: "right", fontSize: 10 }}>
            Tempo estimado:{" "}
            <Countdown
              date={
                Date.now() +
                ((data?.keywords ?? []).length -
                  (data?.keywordsRanked ?? []).length) *
                  50000
              }
            ></Countdown>
          </Typography>
        </Box>

        <TableContainer>
          <Table stickyHeader aria-label="palavras chave">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Palavra-chave</TableCell>
                <TableCell>Posição</TableCell>
                <TableCell>Página</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!keywordsList?.length &&
                keywordsList.map(
                  ({ keyword, link, page, position, title, url }) => (
                    <TableRow key={keyword}>
                      <TableCell>
                        {link === "loading" ? (
                          <CircularProgress size={20} />
                        ) : !position ? (
                          <Clear
                            sx={{
                              backgroundColor: "red",
                              borderRadius: "50%",
                              color: "white",
                              padding: "4px",
                            }}
                          />
                        ) : (
                          <Check
                            sx={{
                              backgroundColor: "#51d302",
                              borderRadius: "50%",
                              color: "white",
                              padding: "4px",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{keyword}</TableCell>
                      <TableCell>
                        {link === "loading" ? "-" : position}
                      </TableCell>
                      <TableCell>{link === "loading" ? "-" : page}</TableCell>
                      <TableCell>
                        {link === "loading"
                          ? "-"
                          : page === null
                          ? "Não encontrada"
                          : "Encontrada"}
                      </TableCell>
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
