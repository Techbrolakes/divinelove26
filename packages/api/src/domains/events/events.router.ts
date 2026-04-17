import { asc } from "drizzle-orm";
import { router, publicProcedure } from "../../trpc";
import { events } from "@repo/db/schema";

export const eventsRouter = router({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.query.events.findMany({
      orderBy: [asc(events.sortOrder), asc(events.date)],
    }),
  ),
});
