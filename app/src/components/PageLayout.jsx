import { useState } from "react";
// import { buyTicket, checkIn, getOwner } from "../api/contract";
import useWallet from "../hooks/useWallet";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import Iconify from "./Iconify";
import Events from "./EventsTab";
import Tickets from "./Tickets";
import Manage from "./Manage";

const PageLayout = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const { account, connectWallet } = useWallet();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <img
                src="android-chrome-192x192.png"
                style={{ height: "3rem" }}
              />
            </IconButton>

            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "none", md: "inline" },
              }}
            >
              TicketApprentice
            </Typography>

            {account ? (
              <Tabs
                value={currentTab}
                onChange={(e, v) => setCurrentTab(v)}
                aria-label="basic tabs example"
              >
                <Tab
                  label="Events"
                  icon={<Iconify icon="mdi:calendar" />}
                  iconPosition="start"
                />
                <Tab
                  label="Tickets"
                  icon={<Iconify icon="mdi:ticket" />}
                  iconPosition="start"
                />
                <Tab
                  label="Manage"
                  icon={<Iconify icon="mdi:wrench" />}
                  iconPosition="start"
                />
              </Tabs>
            ) : (
              <Button
                variant="contained"
                color="inherit"
                onClick={connectWallet}
                startIcon={<Iconify icon="logos:metamask-icon" />}
              >
                Login with MetaMask
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Container sx={{ p: 5 }}>
        {currentTab === 0 && <Events />}

        {currentTab === 1 && <Tickets />}

        {currentTab === 2 && <Manage />}

        {/* <Button onClick={() => buyTicket(1, account)}>Buy Ticket</Button>
        <Button onClick={() => checkIn(1, account)}>Check In</Button>
        <Button
          onClick={async () => {
            let o = await getOwner(account);
            console.log(o);
          }}
        >
          Get Owner
        </Button> */}
      </Container>
    </>
  );
};

export default PageLayout;
