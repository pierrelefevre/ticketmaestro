import { Navigate, useRoutes } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import EventsTab from "./components/EventsTab";
import PurchaseTab from "./components/PurchaseTab";
import ManageTab from "./components/ManageTab";
import TicketsTab from "./components/TicketsTab";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <PageLayout />,
      children: [
        { path: "/", element: <EventsTab /> },
        { path: "manage", element: <ManageTab /> },
        { path: "purchase", element: <PurchaseTab /> },
        { path: "tickets", element: <TicketsTab /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
}
