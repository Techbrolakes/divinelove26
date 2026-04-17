import { z } from "zod";
import { router, adminProcedure } from "../../trpc";
import {
  addGuestSchema,
  deleteGuestSchema,
  importCsvSchema,
} from "./admin.schema";
import * as adminService from "./admin.service";

export const adminRouter = router({
  getStats: adminProcedure.query(({ ctx }) => adminService.getStats(ctx.db)),

  getGuests: adminProcedure.query(({ ctx }) => adminService.getGuests(ctx.db)),

  addGuest: adminProcedure
    .input(addGuestSchema)
    .mutation(({ ctx, input }) => adminService.addGuest(ctx.db, input)),

  deleteGuest: adminProcedure
    .input(deleteGuestSchema)
    .mutation(({ ctx, input }) =>
      adminService.deleteGuest(ctx.db, input.guestId),
    ),

  importGuestsFromCsv: adminProcedure
    .input(importCsvSchema)
    .mutation(({ ctx, input }) =>
      adminService.importGuestsFromCsv(ctx.db, input.csvText),
    ),
});

export type AdminRouter = typeof adminRouter;
// silence unused z warning — keep import for future guest-id query helpers
void z;
