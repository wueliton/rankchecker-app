import { MenuItem, styled } from "@mui/material";

export const MenuButton = styled(MenuItem)({
  marginRight: "-32px",
  padding: "10px 0px",
  color: "#7E8199",
  display: "flex",
  gap: "10px",

  "&.Mui-focusVisible": {
    backgroundColor: "none",
  },
  "&.Mui-selected": {
    background: "none",
    color: "#3661ED",
    borderRight: "4px solid #3661ED",

    "&> .MuiImageListItem-root": {
      color: "#3661ED",
    },

    "&:hover": {
      background: "none",
    },
  },
});
