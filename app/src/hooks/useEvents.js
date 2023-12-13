import { useContext } from "react";
import { EventsContext } from "../context/EventsContext";

const useEvents = () => useContext(EventsContext);

export default useEvents;
