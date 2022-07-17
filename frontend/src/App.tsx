import CssBaseline from "@mui/material/CssBaseline";
import { StorageContextProvider } from "./context/StorageContext";
import { DashboardComponent } from "./components/Dashboard";

function App() {
  return (
    <StorageContextProvider>
      <CssBaseline />
      <DashboardComponent></DashboardComponent>
    </StorageContextProvider>
  );
}

export default App;
