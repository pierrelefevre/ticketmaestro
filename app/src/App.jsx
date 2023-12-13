import { IconButton } from "@mui/material";
import { WalletContextProvider } from "./context/WalletContext";
import { SnackbarProvider, closeSnackbar } from "notistack";
import Iconify from "./components/Iconify";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { EventsContextProvider } from "./context/EventsContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <BrowserRouter>
      <EventsContextProvider>
        <WalletContextProvider>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={5}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              autoHideDuration={3000}
              action={(snack) => (
                <IconButton
                  onClick={() => closeSnackbar(snack)}
                  color="inherit"
                >
                  <Iconify icon="material-symbols:close" />
                </IconButton>
              )}
              dense
              preventDuplicate
            >
              <Router />
            </SnackbarProvider>
          </ThemeProvider>
        </WalletContextProvider>
      </EventsContextProvider>
    </BrowserRouter>
  );
}

export default App;
