import { asc } from "drizzle-orm";
import { router, publicProcedure } from "../../trpc";
import { galleryImages } from "@repo/db/schema";

export const galleryRouter = router({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.query.galleryImages.findMany({
      orderBy: [asc(galleryImages.sortOrder)],
    }),
  ),
});
