import { IconButton } from "@mui/material";
import PageLayout from "./components/PageLayout";
import { WalletContextProvider } from "./context/WalletContext";
import { SnackbarProvider, closeSnackbar } from "notistack";
import Iconify from "./components/Iconify";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <WalletContextProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <SnackbarProvider
          maxSnack={5}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          autoHideDuration={3000}
          action={(snack) => (
            <IconButton onClick={() => closeSnackbar(snack)} color="inherit">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          )}
          dense
          preventDuplicate
        >
          <PageLayout />
        </SnackbarProvider>
      </ThemeProvider>
    </WalletContextProvider>
  );
}

export default App;
