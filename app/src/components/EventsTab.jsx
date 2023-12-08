import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
} from "@mui/material";

import events from "../assets/events.json";

const EventsTab = () => {
  console.log(events);
  return (
    <>
      <Card sx={{ mb: 5 }}>
        <CardMedia sx={{ height: 300 }} image="landing.png" />
        <CardContent>
          <h1>Event tickets - on chain!</h1>
          <p>
            This is a demo for ticketing using the Ethereum blockchain to store
            tickets and events.
          </p>
        </CardContent>
      </Card>

      <h2>Upcoming events</h2>

      {events.events.map((event, index) => (
        <Card sx={{ mb: 5 }} key={"eventCard" + index}>
          <CardHeader title={event.name} />
          <CardContent>
            <p>{event.contractAddress}</p>
          </CardContent>
          <CardActions>
            <Button>Buy tickets</Button>
          </CardActions>
        </Card>
      ))}
    </>
  );
};

export default EventsTab;
