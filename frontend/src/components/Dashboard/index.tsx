import { Box, Drawer, Grid, Typography } from "@mui/material";
import { useState } from "react";
import RankCheckerIcon from "../Icons/AllIcons/RankCheckerIcon";
import SearchIcon from "../Icons/AllIcons/SearchIcon";
import { MenuButton } from "../MenuButton";

type DashboardComponentProps = {
  children: React.ReactElement;
};

export const DashboardComponent = ({ children }: DashboardComponentProps) => {
  const drawerWidth = 240;
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <Box padding={4}>
            <RankCheckerIcon
              sx={{
                color: "white",
                width: 36,
                height: 36,
                marginBottom: "20px",
              }}
            />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 12,
                color: "#A4A6B8",
                textTransform: "uppercase",
              }}
            >
              Análise
            </Typography>
            <MenuButton selected={true}>
              <SearchIcon /> Busca de Palavras
            </MenuButton>
          </Box>
        </Drawer>
      </Box>
      <Box p={2} sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Box
              component="img"
              sx={{
                width: "57px",
                height: "57px",
                borderRadius: "50%",
                border: "1px solid #E6ECF5",
              }}
              src="/conceito-pub.png"
              title="Conceito Publicidade"
            />
          </Grid>
          <Grid item>
            <Typography
              sx={{ fontSize: "24px", fontWeight: 700, lineHeight: "32px" }}
            >
              Bem vindo(a) 👋
            </Typography>
            <Typography sx={{ color: "#A4A6B8" }}>
              Ranqueamento de Palavras-Chave
            </Typography>
          </Grid>
        </Grid>
        {children}
      </Box>
    </Box>
  );
};
