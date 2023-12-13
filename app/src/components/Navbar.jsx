import {
  AppBar,
  Button,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import useWallet from "../hooks/useWallet";
import { useEffect, useState } from "react";
import Iconify from "./Iconify";
import OpenApp from "react-open-app";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { account, connectWallet } = useWallet();

  let location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrentTab(0);
    } else if (location.pathname.startsWith("/purchase")) {
      setCurrentTab(0);
    } else if (location.pathname.startsWith("/tickets")) {
      setCurrentTab(1);
    } else if (location.pathname.startsWith("/manage")) {
      setCurrentTab(2);
    }
  }, [location]);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          component={Link}
          to="/"
        >
          <img src="android-chrome-192x192.png" style={{ height: "3rem" }} />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "none", md: "inline" },
            textDecoration: "none",
          }}
          component={Link}
          to="/"
          color="inherit"
        >
          TicketMaestro
        </Typography>

        {account ? (
          <Tabs value={currentTab} aria-label="basic tabs example">
            <Tab
              label="Events"
              icon={<Iconify icon="mdi:calendar" />}
              iconPosition="start"
              component={Link}
              to="/"
            />
            <Tab
              label="Tickets"
              icon={<Iconify icon="mdi:ticket" />}
              iconPosition="start"
              component={Link}
              to="/tickets"
            />
            <Tab
              label="Manage"
              icon={<Iconify icon="mdi:wrench" />}
              iconPosition="start"
              component={Link}
              to="/manage"
            />
          </Tabs>
        ) : (
          <>
            {!window.navigator.userAgent.includes("MetaMaskMobile") && (
              <OpenApp
                ios="https://metamask.app.link/dapp/ticket.app.cloud.cbh.kth.se/"
                android="https://metamask.app.link/dapp/ticket.app.cloud.cbh.kth.se/"
              >
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="logos:metamask-icon" />}
                  sx={{
                    display: { xs: "inline", sm: "none", md: "none" },
                    textDecoration: "none",
                  }}
                >
                  Open in MetaMask
                </Button>
              </OpenApp>
            )}

            <Button
              variant="contained"
              color="inherit"
              onClick={connectWallet}
              startIcon={<Iconify icon="logos:metamask-icon" />}
              sx={{
                display: window.navigator.userAgent.includes("MetaMaskMobile")
                  ? "inherit"
                  : { xs: "none", sm: "inherit", md: "inherit" },
              }}
            >
              Login with MetaMask
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
