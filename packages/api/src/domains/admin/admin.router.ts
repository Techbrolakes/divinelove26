import { router, adminProcedure } from "../../trpc";
import { guestIdSchema, validateCodeSchema } from "./admin.schema";
import * as adminService from "./admin.service";

export const adminRouter = router({
  getStats: adminProcedure.query(({ ctx }) => adminService.getStats(ctx.db)),

  getGuests: adminProcedure.query(({ ctx }) => adminService.getGuests(ctx.db)),

  deleteGuest: adminProcedure
    .input(guestIdSchema)
    .mutation(({ ctx, input }) =>
      adminService.deleteGuest(ctx.db, input.guestId),
    ),

  sendInvitation: adminProcedure
    .input(guestIdSchema)
    .mutation(({ ctx, input }) =>
      adminService.sendInvitation(ctx.db, input.guestId),
    ),

  validateCode: adminProcedure
    .input(validateCodeSchema)
    .mutation(({ ctx, input }) =>
      adminService.validateCode(ctx.db, input.code),
    ),
});

export type AdminRouter = typeof adminRouter;
