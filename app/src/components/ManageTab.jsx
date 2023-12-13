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
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Slide,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Iconify from "./Iconify";
import { forwardRef, useEffect, useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { getContract } from "../api/contract";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ManageTab = () => {
  const { owned } = useEvents();
  const [active, setActive] = useState(null);
  const [scanned, setScanned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);

  const loadContract = async (address) => {
    let c = await getContract(address);
    console.log(c);
    if (c) {
      setContract(c);
    } else {
      alert("Contract not found");
    }
  };

  const onScan = async (result) => {
    if (!contract) return;
    if (loading) return;

    setLoading(true);
    try {
      let scan = JSON.parse(result);

      let res = await contract.checkIn(scan.id);

      // if not already scanned, add to scanned
      if (!scanned.find((r) => r.id === res.id)) {
        setScanned([...scanned, scan]);
      }
    } catch (e) {
      console.error(e);
      if (e.message.includes("Ticket already used")) {
        alert("Ticket already used");
      } else {
        alert("Error, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (active) {
      loadContract(active.contractAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  //   setLoading(true);
  //   try {
  //     let res = await contract.buyTicket(id, { value: section.price });
  //     console.log(res);

  //     navigate("/tickets");
  //   } catch (e) {
  //     alert("Error buying ticket");
  //     console.error(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <h1>Your events</h1>
      {owned.length === 0 && <LinearProgress />}

      <Grid container spacing={2}>
        {owned.map((event, index) => (
          <Grid item xs={12} md={6} sx={{ mb: 5 }} key={"event" + index}>
            <Card>
              {event.imageUrl && (
                <CardMedia sx={{ height: 200 }} image={event.imageUrl} />
              )}
              <CardHeader
                title={event.name}
                subheader={
                  <>
                    <Iconify icon="mdi:location" /> {event.location}
                  </>
                }
              />
              <CardContent>
                <Typography variant="body" color="text.secondary">
                  {event.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.date.replace("T", " ").split(".")[0]}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  {event.contractAddress}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => setActive(event)}>Check in</Button>
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
        {active && (
          <>
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
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  Check in visitors
                </Typography>
              </Toolbar>
            </AppBar>
            <Box sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6" gutterBottom>
                  {active.name}
                </Typography>
                <Typography variant="body" gutterBottom>
                  Scan the visitor&apos;s QR code to check them in
                </Typography>
                <Box sx={{ maxWidth: 500, mx: "auto" }}>
                  <QrScanner
                    onDecode={(result) => onScan(result)}
                    onError={(error) => console.log(error?.message)}
                  />
                </Box>
                {loading && <LinearProgress />}
                {scanned.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Scanned
                    </Typography>
                    <List>
                      {scanned.map((s, index) => (
                        <ListItem key={"scanResult-" + index}>
                          <ListItemText primary={s.id} secondary={s.address} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Stack>
            </Box>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ManageTab;
