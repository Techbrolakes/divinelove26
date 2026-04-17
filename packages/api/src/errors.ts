import { TRPCError } from "@trpc/server";

export function notFound(entity: string): never {
  throw new TRPCError({ code: "NOT_FOUND", message: `${entity} not found` });
}

export function forbidden(message: string): never {
  throw new TRPCError({ code: "FORBIDDEN", message });
}

export function badRequest(message: string): never {
  throw new TRPCError({ code: "BAD_REQUEST", message });
}

export function conflict(message: string): never {
  throw new TRPCError({ code: "CONFLICT", message });
}

export function unauthorized(message: string): never {
  throw new TRPCError({ code: "UNAUTHORIZED", message });
}

export function serverError(message: string): never {
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
}
