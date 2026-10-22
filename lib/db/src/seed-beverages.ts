import {
  db,
  beverageProductsTable,
  eventBeverageBundlesTable,
  beverageVouchersTable,
  eventsTable,
  usersTable,
} from "./index";
import { eq } from "drizzle-orm";

export const INITIAL_BEVERAGE_SKUS = [
  {
    name: "Kultr Zobo Tonic",
    flavor: "Sparkling Hibiscus & Ginger",
    sku: "KTR-DRK-HIB-330",
    volumeMl: 330,
    description:
      "Craft botanical soda brewed with organic hibiscus calyces, fiery East African ginger, and a crisp citrus finish. Low-sugar, non-alcoholic festival refresher.",
    basePrice: "250.00",
    currency: "KES",
    isActive: true,
  },
  {
    name: "Kultr Guaraná Brew",
    flavor: "Single-Origin Cold Brew & Guaraná",
    sku: "KTR-DRK-GUA-330",
    volumeMl: 330,
    description:
      "Nitrogen-infused cold brew made with high-altitude Kenyan AA coffee beans and natural guaraná extract for sustained high-energy festival stamina.",
    basePrice: "300.00",
    currency: "KES",
    isActive: true,
  },
  {
    name: "Kultr Tamarind Citrus Spritz",
    flavor: "Coastal Tamarind & Calamansi",
    sku: "KTR-DRK-TAM-330",
    volumeMl: 330,
    description:
      "A vibrant coastal tonic balancing tangy wild tamarind with sparkling calamansi lime. Electrolyte-rich natural hydration for dancefloors.",
    basePrice: "250.00",
    currency: "KES",
    isActive: true,
  },
];

export async function seedBeverages() {
  console.log("🍹 Seeding initial Kultr Canned Drinks catalog...");
  for (const item of INITIAL_BEVERAGE_SKUS) {
    await db
      .insert(beverageProductsTable)
      .values(item)
      .onConflictDoNothing({ target: beverageProductsTable.sku });
  }
  console.log("✅ Seeded Kultr Canned Drinks products successfully.");

  // Fetch the first product to link to bundles
  const [zobo] = await db
    .select()
    .from(beverageProductsTable)
    .where(eq(beverageProductsTable.sku, "KTR-DRK-HIB-330"))
    .limit(1);

  if (zobo) {
    const events = await db.select().from(eventsTable);
    console.log(`📦 Creating event drink bundle allocations for ${events.length} events...`);
    for (const ev of events) {
      await db
        .insert(eventBeverageBundlesTable)
        .values({
          eventId: ev.id,
          beverageProductId: zobo.id,
          title: "Kultr Zobo 4-Pack Express Bundle",
          quantityUnits: 4,
          bundlePrice: ev.countryCode === "KE" ? "800.00" : "7.00",
          currency: ev.countryCode === "KE" ? "KES" : "USD",
          allocatedInventory: 500,
          claimedInventory: 0,
          isActive: true,
        })
        .onConflictDoNothing();
    }
  }

  // Seed demo attendee voucher for Bar Pass and Bartender Scanner testing
  const [firstEvent] = await db.select().from(eventsTable).limit(1);
  const [firstUser] = await db.select().from(usersTable).limit(1);
  const [firstBundle] = await db.select().from(eventBeverageBundlesTable).limit(1);

  if (firstEvent && firstUser && firstBundle) {
    await db
      .insert(beverageVouchersTable)
      .values({
        voucherCode: "KTR-BAR-8X29Q",
        userId: firstUser.id,
        eventId: firstEvent.id,
        bundleId: firstBundle.id,
        totalUnits: 4,
        redeemedUnits: 1,
        status: "active",
        signatureHash: "sig_demo_hash_ktr_8x29q",
        paymentReference: "demo_ref_ktr_bar_8x29q",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .onConflictDoNothing({ target: beverageVouchersTable.paymentReference });

    await db
      .insert(beverageVouchersTable)
      .values({
        voucherCode: "KTR-BAR-ZOBO-01",
        userId: firstUser.id,
        eventId: firstEvent.id,
        bundleId: firstBundle.id,
        totalUnits: 4,
        redeemedUnits: 0,
        status: "active",
        signatureHash: "sig_demo_hash_ktr_zobo_01",
        paymentReference: "demo_ref_ktr_bar_zobo_01",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .onConflictDoNothing({ target: beverageVouchersTable.paymentReference });

    console.log("🎫 Seeded demo Bar Passes (KTR-BAR-8X29Q, KTR-BAR-ZOBO-01).");
  }
}

if (process.argv[1]?.endsWith("seed-beverages.ts")) {
  seedBeverages()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to seed beverages:", err);
      process.exit(1);
    });
}
