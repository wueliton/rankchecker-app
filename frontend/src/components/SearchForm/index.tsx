import { Box, Button, FormControl, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { useStorageContext } from "../../context/StorageContext";

interface InputErrors {
  client?: string;
  website?: string;
  keywords?: string;
}

export const SearchFormComponent = () => {
  const [errors, setErrors] = useState({} as InputErrors);
  const { setKeywordsState, setIsNewSearch } = useStorageContext();
  const client = useRef<HTMLInputElement>(null);
  const website = useRef<HTMLInputElement>(null);
  const keywords = useRef<HTMLInputElement>(null);

  const handleFormSubmit = () => {
    setErrors(() => ({}));

    if (
      !client.current?.value ||
      !website.current?.value ||
      !keywords.current?.value
    ) {
      return setErrors(() => ({
        ...(!client.current?.value && {
          client: "É necessário informar o nome do cliente",
        }),
        ...(!website.current?.value && {
          website: "É necessário informar o website do cliente.",
        }),
        ...(!keywords.current?.value && {
          keywords: "É necessário informar as palavras chave.",
        }),
      }));
    }

    setIsNewSearch();

    setKeywordsState({
      client: client.current?.value,
      website: website.current?.value,
      keywords: keywords.current?.value.split("\n"),
      keywordsRanked: [],
    });
  };

  return (
    <>
      <Box p={2}>
        <h1>Nova busca</h1>
        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <FormControl sx={{ gridColumn: 1 }}>
            <TextField
              label="Cliente"
              inputRef={client}
              variant="outlined"
              name="client"
              error={!!errors.client}
              helperText={errors.client}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: 2 }}>
            <TextField
              label="Site"
              inputRef={website}
              name="website"
              variant="outlined"
              error={!!errors.website}
              helperText={errors.website}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <TextField
              id="outlined-textarea"
              label="Palavras Chave"
              name="keywords"
              minRows={4}
              maxRows={20}
              inputRef={keywords}
              error={!!errors.keywords}
              helperText={errors.keywords}
              multiline
            />
          </FormControl>
          <Box>
            <Button variant="contained" onClick={handleFormSubmit}>
              Iniciar a busca
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};
