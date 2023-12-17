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
  const [rTickets, setRTickets] = useState([]); // [
  const [owned, setOwned] = useState([]);
  const [rOwned, setROwned] = useState([]);

  const fetchEvents = async () => {
    fetch("https://api.ticketmaestro.fun/events")
      .then((response) => {
        return response.json();
      })
      .then((e) => {
        e.events.sort((a, b) => {
          return new Date(a.date) < new Date(b.date);
        });
        setEvents(e.events);
      });
  };

  const fetchTickets = async () => {
    let userAddress = await getAddress();

    events.forEach(async (event) => {
      let address = event.contractAddress;
      let contract = await getContract(address);
      let t = await contract.getTickets();

      let existing = rTickets.find(
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

      if (tick.ids.length > 0) {
        setRTickets([
          ...rTickets.filter((t) => t.event.contractAddress !== address),
          tick,
        ]);
      }
    });
  };

  const fetchOwned = async () => {
    let wallet = await getAddress();

    events.forEach(async (event) => {
      let address = event.contractAddress;
      let contract = await getContract(address);

      let owner = await contract.owner();

      if (owner === wallet && !rOwned.includes(event)) {
        setROwned([
          ...rOwned.filter((o) => o.contractAddress !== event.contractAddress),
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

  useEffect(() => {
    if (rTickets.length < 2) return;

    let newTickets = rTickets;

    newTickets.sort((a, b) => {
      return new Date(a.event.date) - new Date(b.event.date);
    });

    setTickets(newTickets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rTickets]);

  useEffect(() => {
    if (rOwned.length < 2) return;

    let newOwned = rOwned;

    newOwned.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    setOwned(newOwned);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rOwned]);

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
