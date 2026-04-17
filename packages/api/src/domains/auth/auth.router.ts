import { router, publicProcedure, protectedProcedure } from "../../trpc";
import {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  updateProfileSchema,
} from "./auth.schema";
import * as authService from "./auth.service";

export const authRouter = router({
  signup: publicProcedure
    .input(signupSchema)
    .mutation(({ ctx, input }) => authService.signup(ctx.db, input)),

  login: publicProcedure
    .input(loginSchema)
    .mutation(({ ctx, input }) => authService.login(ctx.db, input)),

  verifyOtp: publicProcedure
    .input(verifyOtpSchema)
    .mutation(({ ctx, input }) => authService.verifyOtp(ctx.db, input)),

  resendOtp: publicProcedure
    .input(resendOtpSchema)
    .mutation(({ ctx, input }) => authService.resendOtp(ctx.db, input)),

  getProfile: protectedProcedure
    .query(({ ctx }) => authService.getProfile(ctx.user)),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(({ ctx, input }) =>
      authService.updateProfile(ctx.db, ctx.user, input),
    ),

  logout: protectedProcedure
    .mutation(({ ctx }) => authService.logout(ctx.db, ctx.sessionToken)),
});
