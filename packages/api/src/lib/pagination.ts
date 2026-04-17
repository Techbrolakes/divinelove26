import { z } from "zod";

export const paginationInput = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

export type PaginationInput = z.infer<typeof paginationInput>;

export function paginate(input: { page: number; limit: number }) {
  return {
    offset: (input.page - 1) * input.limit,
    page: input.page,
    limit: input.limit,
  };
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
) {
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
