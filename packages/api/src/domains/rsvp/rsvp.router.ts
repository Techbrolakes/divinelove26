import { router, publicProcedure } from "../../trpc";
import { registerSchema } from "./rsvp.schema";
import * as rsvpService from "./rsvp.service";

export const rsvpRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(({ ctx, input }) => rsvpService.register(ctx.db, input)),
});
