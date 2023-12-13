import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";

import Iconify from "./Iconify";
import { Link } from "react-router-dom";
import useEvents from "../hooks/useEvents";

const EventsTab = () => {
  const { events } = useEvents();

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
      {events && events.length === 0 ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={2}>
          {events.map((event, index) => (
            <Grid item xs={12} md={6} sx={{ mb: 5 }} key={"eventCard" + index}>
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
                  <Typography variant="caption" color="text.secondary">
                    {event.contractAddress}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/purchase?contract=${event.contractAddress}`}
                  >
                    Buy tickets
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default EventsTab;
