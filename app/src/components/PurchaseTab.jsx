import { useEffect, useState } from "react";
import { getContract } from "../api/contract";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Web3 from "web3";
import useEvents from "../hooks/useEvents";
import Iconify from "./Iconify";
import { useNavigate } from "react-router-dom";

const PurchaseTab = () => {
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [sections, setSections] = useState([]);
  const { events } = useEvents();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadSections = async () => {
    // Get contract param from url
    const urlParams = new URLSearchParams(window.location.search);
    const contractAddress = urlParams.get("contract");

    if (!contractAddress) {
      alert("Contract not found");
      navigate("/")
    }

    setAddress(contractAddress);

    // Get contract instance
    try {
      let c = await getContract(contractAddress);
      console.log(c);
      if (c) {
        setContract(c);
      } else {
        alert("Contract not found");
      }

      let s = await c.getSections();
      console.log(s);
      setSections(s);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let e = events.find((e) => e.contractAddress === address);
    if (e) {
      setEvent(e);
    }
  }, [events, address]);

  const handlePurchase = async (section, id) => {
    setLoading(true);
    try {
      let res = await contract.buyTicket(id, { value: section.price });
      console.log(res);

      navigate("/tickets");
    } catch (e) {
      alert("Error buying ticket");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!sections || sections.length === 0) {
    return <LinearProgress />;
  }

  return (
    <>
      {event && (
        <Card sx={{ mb: 5 }}>
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
            <Typography
              variant="h6"
              color="text.secondary"
              gutterBottom
              sx={{ mb: 3 }}
            >
              {event.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Iconify icon="mdi:calendar" sx={{ mr: 1 }} />{" "}
              {event.date.replace("T", " ").split(".")[0]}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <Iconify icon="mdi:link-variant" sx={{ mr: 1 }} />{" "}
              <a
                style={{ color: "inherit", textDecoration: "none" }}
                href={"https://etherscan.io/address/" + event.contractAddress}
                target="_blank"
                rel="noreferrer"
              >
                {event.contractAddress}
              </a>
            </Typography>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={2}>
          {sections.map((section, index) => (
            <Grid item xs={12} md={6} sx={{ mb: 5 }} key={"eventCard" + index}>
              <Card sx={{ mb: 5 }} key={"eventCard" + index}>
                <CardHeader
                  title={
                    "🎟️ " +
                    section.name.charAt(0).toUpperCase() +
                    section.name.slice(1)
                  }
                />
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={2}
                    useFlexGap
                    flexWrap={"wrap"}
                  >
                    <p>{section.num_tickets + " available"}</p>
                    <p>{section.sold + " sold"}</p>
                    <p>{Web3.utils.fromWei(section.price, "ether") + " ETH"}</p>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Stack
                    direction="row"
                    spacing={2}
                    useFlexGap
                    flexWrap={"wrap"}
                  >
                    <TextField
                      id="outlined-basic"
                      label="Number of tickets"
                      variant="outlined"
                      value="1"
                    />
                    <Button
                      disabled={loading}
                      onClick={() => handlePurchase(section, index)}
                    >
                      Buy tickets
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

/* <Button onClick={() => buyTicket(1, account)}>Buy Ticket</Button>
    <Button onClick={() => checkIn(1, account)}>Check In</Button>
    <Button
      onClick={async () => {
        let o = await getOwner(account);
        console.log(o);
      }}
    >
      Get Owner
    </Button> */

export default PurchaseTab;
