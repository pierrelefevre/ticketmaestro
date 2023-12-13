import useEvents from "../hooks/useEvents";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Modal,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Iconify from "./Iconify";
import { forwardRef, useState } from "react";
import QRCode from "react-qr-code";
import useWallet from "../hooks/useWallet";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TicketsTab = () => {
  const { tickets } = useEvents();
  const [active, setActive] = useState(null);
  const { account } = useWallet();

  return (
    <>
      <Typography variant="h3" gutterBottom sx={{ mb: 5 }}>
        Your tickets
      </Typography>
      {tickets.length === 0 && <LinearProgress />}

      <Grid container spacing={2}>
        {tickets.map((ticket, index) => (
          <Grid item xs={12} md={6} sx={{ mb: 5 }} key={"ticketcard" + index}>
            <Card>
              {ticket.event.imageUrl && (
                <CardMedia sx={{ height: 200 }} image={ticket.event.imageUrl} />
              )}
              <CardHeader
                title={ticket.event.name}
                subheader={
                  <>
                    <Iconify icon="mdi:location" /> {ticket.event.location}
                  </>
                }
              />
              <CardContent>
                <Typography variant="body" color="text.secondary">
                  {ticket.event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.event.date.replace("T", " ").split(".")[0]}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  {ticket.event.contractAddress}
                </Typography>

                <Typography
                  variant="h6"
                  color="text.primary"
                  gutterBottom
                  sx={{ mt: 3 }}
                >
                  🎟️ {ticket.ids.length} tickets
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => setActive(ticket)}>Check in</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        fullScreen
        open={active !== null}
        onClose={() => setActive(null)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setActive(null)}
              aria-label="close"
            >
              <Iconify icon="mdi:close" />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Your tickets
            </Typography>
          </Toolbar>
        </AppBar>
        {active && (
          <List>
            {active.ids.map((id, index) => (
              <Box key={"code" + id} sx={{ p: 5 }}>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  {active.event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {active.event.date.replace("T", " ").split(".")[0]}
                </Typography>

                <Typography variant="body" gutterBottom>
                  {index + 1}/{active.ids.length} - Ticket #{id}
                </Typography>

                <Box
                  style={{
                    height: "auto",
                    maxWidth: 256,
                    width: "100%",
                    padding: 16,
                    background: "#fff",
                  }}
                  sx={{ borderRadius: 2, my: 5, mx: "auto" }}
                >
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={JSON.stringify({ id: id, address: account })}
                    viewBox={`0 0 256 256`}
                  />
                </Box>
                {index < active.ids.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Dialog>
    </>
  );
};

export default TicketsTab;
