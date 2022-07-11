import CssBaseline from "@mui/material/CssBaseline";
import { StorageContextProvider } from "./context/StorageContext";
import { DashboardComponent } from "./components/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardRoute from "./routes/dashboard";
import SearchRoute from "./routes/search";

function App() {
  return (
    <BrowserRouter>
      <StorageContextProvider>
        <CssBaseline />
        <DashboardComponent>
          <Routes>
            <Route path="/" element={<DashboardRoute />} />
            <Route path="/search" element={<SearchRoute />} />
          </Routes>
        </DashboardComponent>
      </StorageContextProvider>
    </BrowserRouter>
  );
}

export default App;
