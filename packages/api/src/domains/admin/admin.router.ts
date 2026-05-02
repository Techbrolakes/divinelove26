import { router, adminProcedure } from "../../trpc";
import {
  adminIdSchema,
  createAdminSchema,
  guestIdSchema,
  validateCodeSchema,
} from "./admin.schema";
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

  listAdmins: adminProcedure.query(({ ctx }) =>
    adminService.listAdmins(ctx.db),
  ),

  createAdmin: adminProcedure
    .input(createAdminSchema)
    .mutation(({ ctx, input }) =>
      adminService.createAdmin(ctx.db, ctx.user.id, input),
    ),

  deleteAdmin: adminProcedure
    .input(adminIdSchema)
    .mutation(({ ctx, input }) =>
      adminService.deleteAdmin(ctx.db, ctx.user.id, input.adminId),
    ),
});

export type AdminRouter = typeof adminRouter;
