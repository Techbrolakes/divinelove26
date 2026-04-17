import { events, galleryImages } from "../schema/index";
import { createSeedDb, runSeed } from "./seed-helpers";

const { db, client } = createSeedDb();

const EVENTS = [
  {
    name: "Wedding Ceremony",
    date: new Date("2026-06-20T14:00:00Z"),
    venueName: "Venue Name",
    venueAddress: "123 Beautiful Street, City, State",
    dressCode: "Formal Attire",
    description:
      "Join us as we exchange vows and begin our journey together as one.",
    sortOrder: 0,
  },
  {
    name: "Reception",
    date: new Date("2026-06-20T17:00:00Z"),
    venueName: "Reception Venue",
    venueAddress: "456 Celebration Avenue, City, State",
    dressCode: "Formal Attire",
    description:
      "Dinner, dancing, and celebration. We can't wait to share this joyous evening with you.",
    sortOrder: 1,
  },
];

const GALLERY = [
  { src: "/gallery/couple-01.jpg", alt: "Couple embracing warmly", sortOrder: 0 },
  { src: "/gallery/couple-02.jpg", alt: "Couple sharing a tender moment", sortOrder: 1 },
  { src: "/gallery/couple-03.jpg", alt: "Couple laughing together", sortOrder: 2 },
  { src: "/gallery/couple-04.jpg", alt: "Intimate couple portrait", sortOrder: 3 },
  { src: "/gallery/couple-05.jpg", alt: "Couple in a loving embrace", sortOrder: 4 },
  { src: "/gallery/couple-06.jpg", alt: "Couple sitting together", sortOrder: 5 },
];

runSeed("wedding", async () => {
  const existingEvents = await db.query.events.findMany();
  if (existingEvents.length === 0) {
    await db.insert(events).values(EVENTS);
    console.log(`Inserted ${EVENTS.length} events`);
  } else {
    console.log(`Events already seeded (${existingEvents.length} rows)`);
  }

  const existingImages = await db.query.galleryImages.findMany();
  if (existingImages.length === 0) {
    await db.insert(galleryImages).values(GALLERY);
    console.log(`Inserted ${GALLERY.length} gallery images`);
  } else {
    console.log(`Gallery already seeded (${existingImages.length} rows)`);
  }

  await client.end();
});
