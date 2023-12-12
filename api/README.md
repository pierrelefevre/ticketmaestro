# 🎟️ ticketmaestro/api

## A very rudimentary API
The API is intended to keep track of the currently deployed TicketMaestro contracts.

## Endpoints
### GET /events
Returns a list of all events.

```sh 
curl https://api.ticketmaestro.fun/events
```
```json
{
  "events": [
    {
      "contractAddress": "0x98C052036B69129E6007b50136b3DaA6E9A8c7a4",
      "description": "Taylor swift is coming to town!",
      "imageUrl": "https://wallpaper-of-the-day.app.cloud.cbh.kth.se/",
      "location": "Stockholm, Sweden",
      "name": "Taylor Swift Stockholm"
    }
  ]
}
```

### POST /events
Creates a new event.

```sh
curl -X POST -H "Content-Type: application/json" -d \
'{
    "contractAddress": "0x98C052036B69129E6007b50136b3DaA6E9A8c7a4",
    "name": "Taylor Swift Stockholm",
    "imageUrl": "https://wallpaper-of-the-day.app.cloud.cbh.kth.se/",
    "description": "Taylor swift is coming to town!",
    "location": "Stockholm, Sweden"
}' https://api.ticketmaestro.fun/events
```
```json
{
  "contractAddress": "0x98C052036B69129E6007b50136b3DaA6E9A8c7a4",
  "description": "Taylor swift is coming to town!",
  "imageUrl": "https://wallpaper-of-the-day.app.cloud.cbh.kth.se/",
  "location": "Stockholm, Sweden",
  "name": "Taylor Swift Stockholm"
}
```
