import { db, questsTable, perksTable } from "./index.js";

/**
 * Seeds the quest catalog + redeemable perks shown in the "Cultural Quest"
 * slide. Idempotent: re-running only inserts rows whose slug is missing.
 */
const QUESTS = [
  {
    slug: "art-appreciator",
    name: "Art Appreciator",
    description: "Explore 3 art exhibitions and immerse yourself in the scene.",
    matchRule: "category" as const,
    requiredCategory: "Art" as const,
    targetCount: 3,
    pointsReward: 150,
    collectibleSlug: "art-appreciator",
    collectibleName: "Art Appreciator",
    collectibleRarity: "rare" as const,
    badgeImageKey: "art",
    sortOrder: 1,
  },
  {
    slug: "music-maestro",
    name: "Music Maestro",
    description: "Attend live music events and feel the rhythm of the continent.",
    matchRule: "category" as const,
    requiredCategory: "Music" as const,
    targetCount: 3,
    pointsReward: 200,
    collectibleSlug: "music-maestro",
    collectibleName: "Music Maestro",
    collectibleRarity: "epic" as const,
    badgeImageKey: "concert",
    sortOrder: 2,
  },
  {
    slug: "festival-fanatic",
    name: "Festival Fanatic",
    description: "Show up to a cultural festival and soak in the celebration.",
    matchRule: "tag" as const,
    requiredTag: "Festival",
    targetCount: 1,
    pointsReward: 175,
    collectibleSlug: "festival-fanatic",
    collectibleName: "Festival Fanatic",
    collectibleRarity: "rare" as const,
    badgeImageKey: "festival",
    sortOrder: 3,
  },
  {
    slug: "story-seeker",
    name: "Story Seeker",
    description: "Visit 2 heritage experiences and learn the stories behind them.",
    matchRule: "category" as const,
    requiredCategory: "Heritage" as const,
    targetCount: 2,
    pointsReward: 125,
    collectibleSlug: "story-seeker",
    collectibleName: "Story Seeker",
    collectibleRarity: "rare" as const,
    badgeImageKey: "heritage",
    sortOrder: 4,
  },
  {
    slug: "early-bird",
    name: "Early Bird",
    description: "Book a ticket at least a week before the event.",
    matchRule: "early_bird" as const,
    earlyBirdDays: 7,
    targetCount: 1,
    pointsReward: 100,
    collectibleSlug: "early-bird",
    collectibleName: "Early Bird",
    collectibleRarity: "common" as const,
    badgeImageKey: "ticket",
    sortOrder: 5,
  },
  {
    slug: "culture-explorer",
    name: "Culture Explorer",
    description: "Attend 5 events across the platform and explore the culture.",
    matchRule: "any" as const,
    targetCount: 5,
    pointsReward: 250,
    collectibleSlug: "culture-explorer",
    collectibleName: "Culture Explorer",
    collectibleRarity: "epic" as const,
    badgeImageKey: "compass",
    sortOrder: 6,
  },
  {
    slug: "afrobeats-pilgrim",
    name: "Afrobeats Pilgrim",
    description: "Attend live Afrobeats and Amapiano experiences across the global diaspora.",
    matchRule: "tag" as const,
    requiredTag: "Afrobeats",
    targetCount: 2,
    pointsReward: 250,
    collectibleSlug: "afrobeats-pilgrim",
    collectibleName: "Afrobeats Pilgrim",
    collectibleRarity: "legendary" as const,
    badgeImageKey: "concert",
    sortOrder: 7,
  },
  {
    slug: "carnival-connoisseur",
    name: "Carnival Connoisseur",
    description: "Immerse yourself in Caribbean and diaspora carnival and soca celebrations.",
    matchRule: "tag" as const,
    requiredTag: "Carnival",
    targetCount: 1,
    pointsReward: 200,
    collectibleSlug: "carnival-connoisseur",
    collectibleName: "Carnival Connoisseur",
    collectibleRarity: "epic" as const,
    badgeImageKey: "festival",
    sortOrder: 8,
  },
  {
    slug: "diaspora-palate",
    name: "Diaspora Palate",
    description: "Taste authentic culinary heritage at 2 Pan-African or Caribbean food events.",
    matchRule: "category" as const,
    requiredCategory: "Food" as const,
    targetCount: 2,
    pointsReward: 175,
    collectibleSlug: "diaspora-palate",
    collectibleName: "Diaspora Palate",
    collectibleRarity: "rare" as const,
    badgeImageKey: "food",
    sortOrder: 9,
  },
];

const PERKS = [
  {
    slug: "backstage-digital-content",
    name: "Backstage Digital Content",
    description: "Unlock exclusive behind-the-scenes photos and clips.",
    cost: 150,
    repeatable: true,
  },
  {
    slug: "vip-lounge-access",
    name: "VIP Lounge Access",
    description: "Redeem a VIP lounge pass at a participating event.",
    cost: 300,
    repeatable: false,
  },
  {
    slug: "exclusive-merch-drop",
    name: "Exclusive Merch Drop",
    description: "Claim a limited-edition Kultr merch item.",
    cost: 500,
    repeatable: false,
  },
];

async function seedGamification() {
  console.log("Seeding gamification (quests + perks)...");

  for (const q of QUESTS) {
    await db.insert(questsTable).values(q).onConflictDoNothing({ target: questsTable.slug });
    console.log(`  ✓ Quest: ${q.name}`);
  }

  for (const p of PERKS) {
    await db.insert(perksTable).values(p).onConflictDoNothing({ target: perksTable.slug });
    console.log(`  ✓ Perk: ${p.name}`);
  }

  console.log("Done.");
  process.exit(0);
}

seedGamification().catch((err) => {
  console.error(err);
  process.exit(1);
});
