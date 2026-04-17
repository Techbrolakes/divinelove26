import { router, publicProcedure } from "../../trpc";
import { guestLookupSchema, rsvpSchema } from "./rsvp.schema";
import * as rsvpService from "./rsvp.service";

export const rsvpRouter = router({
  lookupGuest: publicProcedure
    .input(guestLookupSchema)
    .mutation(({ ctx, input }) => rsvpService.lookupGuest(ctx.db, input)),

  submitRsvp: publicProcedure
    .input(rsvpSchema)
    .mutation(({ ctx, input }) => rsvpService.submitRsvp(ctx.db, input)),
});
