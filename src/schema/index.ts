import { CouponCodeType, DiscountType } from "@prisma/client";
import { z } from "zod";

export const loginSchemaWithUsername = z.object({
  userName: z.string().min(1),
  password: z.string().min(1),
});

export const signupClientSchema = z
  .object({
    userName: z.string().min(4),
    email: z.string().min(1).email(),
    password: z.string().min(8).max(32),
    confirmPassword: z.string().min(8).max(32),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
      });
    }
  });

export const PorductSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  purchasePrice: z.string().min(1),
  sellPrice: z.string().min(1),
  quantity: z.string().min(1),
  SKU: z.string().optional(),
  pricingRulesId: z.string().array().optional(),
  description: z.string().optional(),
  imageLink: z.string().optional(),
});

export const NforX = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.string().min(1),
  price: z.string().min(1),
});

export const VolumePricing = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.string().min(1),
  free: z.string().min(1),
});

export const PercentageDiscount = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  threshold: z.string().min(1),
  discount: z.string().min(1),
});

export const cartSchema = z.object({
  productId: z.string().min(1),
});

export const couponCodesSchema = z.object({
  code: z.string().min(1),
  type: z.nativeEnum(CouponCodeType),
  discountType: z.nativeEnum(DiscountType),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  discount: z.string().optional(),
  quantity: z.string().optional(),
});
