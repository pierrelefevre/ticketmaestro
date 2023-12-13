import { useState, createContext, useEffect } from "react";
import { getAddress, getContract } from "../api/contract";
import useInterval from "../hooks/useInterval";

const initialState = {
  events: [],
  tickets: [],
  owned: [],
};

export const EventsContext = createContext({
  ...initialState,
});

export const EventsContextProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [owned, setOwned] = useState([]);

  const fetchEvents = async () => {
    fetch("https://api.ticketmaestro.fun/events")
      .then((response) => {
        return response.json();
      })
      .then((e) => {
        setEvents(e.events);
      });
  };

  const fetchTickets = async () => {
    let userAddress = await getAddress();

    events.forEach(async (event) => {
      let address = event.contractAddress;
      let contract = await getContract(address);
      let t = await contract.getTickets();

      let existing = tickets.find(
        (ticket) => ticket.event.contractAddress === address
      );

      let ids = [];
      if (existing) {
        ids = existing.ids;
      }

      t.forEach((ticket, index) => {
        if (ticket[1] === userAddress) {
          if (!ids.includes(index)) {
            ids.push(index);
          }
        }
      });

      let tick = {
        event: event,
        ids: ids.sort(),
      };

      setTickets([
        ...tickets.filter((t) => t.event.contractAddress !== address),
        tick,
      ]);
    });
  };

  const fetchOwned = async () => {
    let wallet = await getAddress();

    events.forEach(async (event) => {
      let address = event.contractAddress;
      let contract = await getContract(address);

      let owner = await contract.owner();

      if (owner === wallet && !owned.includes(event)) {
        setOwned([
          ...owned.filter((o) => o.contractAddress !== event.contractAddress),
          event,
        ]);
      }
    });
  };

  const refresh = async () => {
    await fetchEvents();
    await fetchTickets();
    await fetchOwned();
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    refresh();
  }, 1000);

  return (
    <EventsContext.Provider
      value={{
        events,
        setEvents,
        tickets,
        setTickets,
        owned,
        setOwned,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export default EventsContext;
