import { db, eventsTable, ticketTypesTable } from "./index.js";
import { seedBeverages } from "./seed-beverages.js";

const SEED_EVENTS = [
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Afrobeats NYC",
    subtitle: "Africa Comes to the Big Apple",
    description:
      "The biggest Afrobeats celebration ever to land in New York City. Madison Square Garden hosts a night of chart-topping African artists, fusing the sounds of Lagos, Accra, and London in the heart of Manhattan.",
    category: "Music" as const,
    venue: "Madison Square Garden",
    city: "New York",
    country: "United States",
    countryCode: "US",
    eventDate: new Date("2026-09-13T20:00:00Z"),
    imageKey: "concert",
    capacity: 20000,
    tags: ["Live Music", "Afrobeats", "Global Diaspora", "Concert"],
    featured: true,
    status: "live" as const,
    ticketPrice: "65.00",
    currency: "USD",
  },
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Notting Hill Carnival After-Party",
    subtitle: "London's Premier Afrobeats & Amapiano Night",
    description:
      "After the parade winds down, London's diaspora convenes at Fabric for the ultimate carnival after-party. World-class DJs spinning Afrobeats, Afro-swing, Amapiano, and Dancehall through the night.",
    category: "Nightlife" as const,
    venue: "Fabric London EC1",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    eventDate: new Date("2026-08-25T21:00:00Z"),
    imageKey: "concert",
    capacity: 1500,
    tags: ["Carnival", "Afrobeats", "London", "Nightlife"],
    featured: true,
    status: "live" as const,
    ticketPrice: "35.00",
    currency: "GBP",
  },
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Toronto Caribbean Festival",
    subtitle: "Canada's Largest Cultural Celebration",
    description:
      "Experience the warmth and spirit of the islands on Lake Ontario's shores with traditional masquerade costumes, Soca, Calypso, and Caribbean cuisine.",
    category: "Heritage" as const,
    venue: "Exhibition Place",
    city: "Toronto",
    country: "Canada",
    countryCode: "CA",
    eventDate: new Date("2026-08-01T14:00:00Z"),
    imageKey: "culture",
    capacity: 15000,
    tags: ["Caribana", "Soca", "Toronto", "Carnival"],
    featured: true,
    status: "live" as const,
    ticketPrice: "30.00",
    currency: "CAD",
  },
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Afro Nation Portugal",
    subtitle: "Europe's Largest Beachfront Afrobeats Festival",
    description:
      "Three sun-drenched days on Praia da Rocha with the biggest stars in Afrobeats, Amapiano, and Dancehall alongside attendees from over 100 countries.",
    category: "Music" as const,
    venue: "Praia da Rocha",
    city: "Portimão",
    country: "Portugal",
    countryCode: "PT",
    eventDate: new Date("2026-07-09T16:00:00Z"),
    imageKey: "concert",
    capacity: 40000,
    tags: ["Festival", "Afrobeats", "Amapiano", "Beach"],
    featured: true,
    status: "live" as const,
    ticketPrice: "199.00",
    currency: "EUR",
  },
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Kingston Carnival",
    subtitle: "Jamaica's Greatest Street Celebration",
    description:
      "An electrifying explosion of dancehall, reggae, and masquerade on the Kingston Waterfront. The ultimate celebration of Caribbean music, sound systems, and island pride.",
    category: "Heritage" as const,
    venue: "Kingston Waterfront",
    city: "Kingston",
    country: "Jamaica",
    countryCode: "JM",
    eventDate: new Date("2026-08-03T16:00:00Z"),
    imageKey: "culture",
    capacity: 10000,
    tags: ["Carnival", "Dancehall", "Jamaica", "Reggae"],
    featured: true,
    status: "live" as const,
    ticketPrice: "3500.00",
    currency: "JMD",
  },
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Paris Afropolis",
    subtitle: "The Afro-Cultural Capital of Europe",
    description:
      "An avant-garde convergence of Pan-African fashion, photography, live jazz fusion, and contemporary electronic sounds in the cultural heart of Paris.",
    category: "Art" as const,
    venue: "Parc de la Villette",
    city: "Paris",
    country: "France",
    countryCode: "FR",
    eventDate: new Date("2026-06-25T17:00:00Z"),
    imageKey: "art",
    capacity: 2500,
    tags: ["Art", "Fashion", "Paris", "Pan-African"],
    featured: false,
    status: "live" as const,
    ticketPrice: "45.00",
    currency: "EUR",
  },
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Lagos Afro Street Festival",
    subtitle: "Culture, Music & Food in the Heart of Lagos",
    description:
      "West Africa's most iconic street carnival returning to Eko Atlantic with over 100 Nigerian creators, live performances, street food, and runway showcases.",
    category: "Music" as const,
    venue: "Eko Atlantic",
    city: "Lagos",
    country: "Nigeria",
    countryCode: "NG",
    eventDate: new Date("2026-07-05T14:00:00Z"),
    imageKey: "concert",
    capacity: 5000,
    tags: ["Festival", "Afrobeats", "Street Food", "Fashion"],
    featured: true,
    status: "live" as const,
    ticketPrice: "15000.00",
    currency: "NGN",
  },
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Afrobeat Nights",
    subtitle: "A Night of Pure Rhythm",
    description:
      "Experience the heartbeat of East Africa at Afrobeat Nights — an electrifying showcase of live bands, top DJs, and cultural immersion.",
    category: "Music" as const,
    venue: "Alchemist Bar",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    eventDate: new Date("2026-06-14T20:00:00Z"),
    imageKey: "concert",
    capacity: 800,
    tags: ["Live Music", "Afrobeats", "DJ Sets"],
    featured: true,
    status: "live" as const,
    ticketPrice: "1500.00",
    currency: "KES",
  },
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Echoes of Identity",
    subtitle: "Contemporary African Art Exhibition",
    description:
      "A landmark exhibition bringing together 30 artists exploring African identity and diaspora memory through mixed media, sculpture, and photography.",
    category: "Art" as const,
    venue: "GoDown Arts Centre",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    eventDate: new Date("2026-06-20T10:00:00Z"),
    imageKey: "art",
    capacity: 300,
    tags: ["Art", "Exhibition", "African Identity"],
    featured: false,
    status: "live" as const,
    ticketPrice: "800.00",
    currency: "KES",
  },
  {
    creatorId: "00000000-0000-0000-0000-000000000001",
    title: "Accra Jazz Night",
    subtitle: "West African Jazz Showcase",
    description:
      "Ghana's finest jazz masters take the stage at Alliance Française for an intimate evening of Highlife-infused African jazz.",
    category: "Music" as const,
    venue: "Alliance Française d'Accra",
    city: "Accra",
    country: "Ghana",
    countryCode: "GH",
    eventDate: new Date("2026-06-28T19:00:00Z"),
    imageKey: "concert",
    capacity: 200,
    tags: ["Jazz", "Highlife", "Live Music"],
    featured: false,
    status: "live" as const,
    ticketPrice: "120.00",
    currency: "GHS",
  },
];

async function seed() {
  console.log("Seeding global diaspora database...");

  for (const item of SEED_EVENTS) {
    const { ticketPrice, currency, ...eventData } = item;
    const [event] = await db.insert(eventsTable).values(eventData).returning();

    await db.insert(ticketTypesTable).values([
      {
        eventId: event.id,
        name: "General Admission",
        price: ticketPrice,
        currency: currency,
        totalQuantity: 300,
      },
      {
        eventId: event.id,
        name: "VIP Pass",
        description: "Priority express entry and dedicated lounge access",
        price: (parseFloat(ticketPrice) * 2.5).toFixed(2),
        currency: currency,
        totalQuantity: 50,
      },
    ]);
    console.log(`  ✓ Seeded: ${event.title} (${event.city}, ${event.country})`);
  }

  await seedBeverages();

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
