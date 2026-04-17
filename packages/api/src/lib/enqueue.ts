import { sendVerificationOTP, sendWelcomeEmail } from "@repo/email";

export type EmailJob =
  | { type: "send-verification-otp"; email: string; otp: string }
  | { type: "send-welcome-email"; email: string; firstName: string };

export function enqueueEmail(job: EmailJob): void {
  const run = async () => {
    if (job.type === "send-verification-otp") {
      await sendVerificationOTP(job.email, job.otp);
    } else if (job.type === "send-welcome-email") {
      await sendWelcomeEmail(job.email, job.firstName);
    }
  };

  run().catch((err) => {
    console.error(`[email] ${job.type} failed:`, err);
  });
}
