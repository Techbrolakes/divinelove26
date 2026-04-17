import { router } from "./trpc";
import { authRouter } from "./domains/auth/auth.router";
import { rsvpRouter } from "./domains/rsvp/rsvp.router";
import { adminRouter } from "./domains/admin/admin.router";
import { galleryRouter } from "./domains/gallery/gallery.router";
import { eventsRouter } from "./domains/events/events.router";

export const appRouter = router({
  auth: authRouter,
  rsvp: rsvpRouter,
  admin: adminRouter,
  gallery: galleryRouter,
  events: eventsRouter,
});

export type AppRouter = typeof appRouter;
