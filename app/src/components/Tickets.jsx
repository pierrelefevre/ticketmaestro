import { useEffect, useState } from "react";
import { getContract, getSections } from "../api/contract";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";

const Tickets = ({ setCurrentTab }) => {
  const [contract, setContract] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Get contract param from url
    const urlParams = new URLSearchParams(window.location.search);
    const contractAddress = urlParams.get("contract");

    if (!contractAddress) {
      alert("Contract not found");
      setCurrentTab(0);
    }

    // Get contract instance
    try {
      let c = getContract(contractAddress);
      console.log(c);
      if (c) {
        setContract(c);
      } else {
        alert("Contract not found");
        setCurrentTab(0);
      }

      getSections(c).then((sections) => {
        console.log(sections);
        setSections(sections);
      });
    } catch (e) {
      console.error(e);
      setCurrentTab(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {sections.map((section, index) => (
        <Card sx={{ mb: 5 }} key={"eventCard" + index}>
          <CardHeader title={section.name} />
          <CardContent>
            <p>{section.num_tickets + " available"}</p>
            <p>{section.sold + " sold"}</p>
            <p>{section.price + " Wei"}</p>
          </CardContent>
          <CardActions>
            <TextField
              id="outlined-basic"
              label="Number of tickets"
              variant="outlined"
              value="1"
            />
            <Button>Buy tickets</Button>
          </CardActions>
        </Card>
      ))}
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

export default Tickets;
