import { z } from "zod";

/**
 * Create Package Schema
 */

export const createPackageSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").trim(),

    type: z.string().min(1, "Type is required"),

    description: z.string().optional(),

    maxPostsPerDay: z.coerce.number().int().min(0, "Must be >= 0").optional(),

    maxTotalPosts: z.coerce.number().int().min(0, "Must be >= 0").optional(),

    price: z.coerce
      .number({
        required_error: "Price is required",
      })
      .min(0, "Price must be >= 0"),

    durationDays: z.coerce
      .number({
        required_error: "Duration is required",
      })
      .int()
      .min(1, "Duration must be at least 1 day"),

    allowHotPost: z.coerce.boolean().optional(),

    autoApprove: z.coerce.boolean().optional(),

    priority: z.coerce.number().int().min(0).optional(),
  }),
});
export const updatePackageSchema = z.object({
  body: z.object({
    name: z.string().min(1).trim().optional(),

    type: z.string().min(1).optional(),

    description: z.string().optional(),

    maxPostsPerDay: z.coerce.number().int().min(0).optional(),

    maxTotalPosts: z.coerce.number().int().min(0).optional(),

    price: z.coerce.number().min(0).optional(),

    durationDays: z.coerce.number().int().min(1).optional(),

    allowHotPost: z.coerce.boolean().optional(),

    autoApprove: z.coerce.boolean().optional(),

    priority: z.coerce.number().int().min(0).optional(),

    isActive: z.coerce.boolean().optional(),
  }),

  params: z.object({
    id: z.string().min(1, "Package id is required"),
  }),
});
