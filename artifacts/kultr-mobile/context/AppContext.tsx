import React, { createContext, useContext, useState } from "react";
import { EA_COUNTRIES, type EACountry } from "@/constants/currencies";

export interface PurchasedTicket {
  id: string;
  eventId: string;
  ticketTypeId: string;
  ticketTypeName: string;
  ticketNumber: string;
  purchaseDate: string;
  quantity: number;
  totalPaid: number;
  currency: string;
  currencySymbol: string;
}

export interface CreatedEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  currency: string;
  currencySymbol: string;
  description: string;
  ticketsSold: number;
  revenue: number;
  status: "draft" | "live" | "ended";
  createdAt: string;
}

interface AppContextType {
  tickets: PurchasedTicket[];
  savedEvents: string[];
  userCountry: EACountry;
  onboardingDone: boolean;
  userInterests: string[];
  createdEvents: CreatedEvent[];
  addTicket: (ticket: PurchasedTicket) => void;
  toggleSaved: (eventId: string) => void;
  isSaved: (eventId: string) => boolean;
  setUserCountry: (country: EACountry) => void;
  setOnboardingDone: (done: boolean) => void;
  setUserInterests: (interests: string[]) => void;
  addCreatedEvent: (event: CreatedEvent) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_COUNTRY = EA_COUNTRIES.find((c) => c.code === "KE")!;

const DEMO_CREATED_EVENTS: CreatedEvent[] = [
  {
    id: "ce-001",
    title: "Nairobi Jazz Collective",
    category: "Music",
    date: "2026-07-20",
    time: "19:00",
    venue: "Sankara Nairobi",
    city: "Nairobi",
    price: 2500,
    currency: "KES",
    currencySymbol: "KSh",
    description: "An intimate evening of East African jazz.",
    ticketsSold: 142,
    revenue: 355000,
    status: "live",
    createdAt: "2026-05-01",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<PurchasedTicket[]>([
    {
      id: "ticket-demo-001",
      eventId: "evt-004",
      ticketTypeId: "t1",
      ticketTypeName: "General Admission",
      ticketNumber: "KTR-98321",
      purchaseDate: "2026-05-10",
      quantity: 1,
      totalPaid: 2000,
      currency: "KES",
      currencySymbol: "KSh",
    },
  ]);
  const [savedEvents, setSavedEvents] = useState<string[]>(["evt-002"]);
  const [userCountry, setUserCountry] = useState<EACountry>(DEFAULT_COUNTRY);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>(DEMO_CREATED_EVENTS);

  const addTicket = (ticket: PurchasedTicket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  const toggleSaved = (eventId: string) => {
    setSavedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const isSaved = (eventId: string) => savedEvents.includes(eventId);

  const addCreatedEvent = (event: CreatedEvent) => {
    setCreatedEvents((prev) => [event, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        tickets,
        savedEvents,
        userCountry,
        onboardingDone,
        userInterests,
        createdEvents,
        addTicket,
        toggleSaved,
        isSaved,
        setUserCountry,
        setOnboardingDone,
        setUserInterests,
        addCreatedEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
