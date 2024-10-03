"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { PercentageDiscount, VolumePricing, NforX } from "@/schema";
import { PricingRuleType } from "@prisma/client";
import { z } from "zod";
interface PricingRuleValues {
  name: string;
  type: string;
  description?: string;
  discount?: string;
  free?: string;
  price?: string;
  quantity?: string;
  threshold?: string;
}

export const addPricingRule = async (
  values: z.infer<
    typeof PercentageDiscount | typeof VolumePricing | typeof NforX
  >
) => {
  const validatedFieldsPercentageDiscount =
    PercentageDiscount.safeParse(values);
  const validatedFieldsVolumePricing = VolumePricing.safeParse(values);
  const validatedFieldsNforX = NforX.safeParse(values);
  const validatedFields =
    validatedFieldsPercentageDiscount.success ||
    validatedFieldsVolumePricing.success ||
    validatedFieldsNforX.success;
  if (!validatedFields) {
    return { error: "Invalid fields!" };
  }
  try {
    const valuesAsPricingRuleValues = values as PricingRuleValues;
    await db.pricingRule.create({
      data: {
        name: valuesAsPricingRuleValues.name,
        type: valuesAsPricingRuleValues.type as PricingRuleType,
        description: valuesAsPricingRuleValues.description,
        discount: valuesAsPricingRuleValues.discount
          ? +valuesAsPricingRuleValues.discount
          : null,
        free: valuesAsPricingRuleValues.free
          ? +valuesAsPricingRuleValues.free
          : null,
        price: valuesAsPricingRuleValues.price
          ? +valuesAsPricingRuleValues.price
          : null,
        quantity: valuesAsPricingRuleValues.quantity
          ? +valuesAsPricingRuleValues.quantity
          : null,
        threshold: valuesAsPricingRuleValues.threshold
          ? +valuesAsPricingRuleValues.threshold
          : null,
      },
    });
    return { success: true };
  } catch {
    return { error: "resultNotOk" };
  }
};

export const getAllPrcingRules = async () => {
  try {
    const PricingRules = await db.pricingRule.findMany();
    return { success: true, PricingRules: PricingRules };
  } catch {
    return { error: "resultNotOk" };
  }
};

export const getPrcingRule = async (id: string) => {
  try {
    const prcingRule = await db.pricingRule.findUnique({
      where: { id },
    });
    if (!prcingRule) {
      return { error: "not found" };
    }
    return { success: true, prcingRule };
  } catch {
    return { error: "resultNotOk" };
  }
};

export const updatePricingRule = async (
  id: string,
  values: z.infer<
    typeof NforX | typeof VolumePricing | typeof PercentageDiscount
  >
) => {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "you are not logged in" };
  }

  if (user.role !== "ADMIN") {
    return { error: "you don't have access" };
  }

  try {
    const validatedFieldsPercentageDiscount =
      PercentageDiscount.safeParse(values);
    const validatedFieldsVolumePricing = VolumePricing.safeParse(values);
    const validatedFieldsNforX = NforX.safeParse(values);
    const validatedFields =
      validatedFieldsPercentageDiscount.success ||
      validatedFieldsVolumePricing.success ||
      validatedFieldsNforX.success;
    if (!validatedFields) {
      return { error: "Invalid fields!" };
    }

    const pricingRule = await db.pricingRule.findUnique({
      where: { id },
    });
    if (!pricingRule) {
      return { error: "not found" };
    }
    const valuesAsPricingRuleValues = values as PricingRuleValues;
    await db.pricingRule.update({
      where: { id: id },
      data: {
        name: valuesAsPricingRuleValues.name,
        type: valuesAsPricingRuleValues.type as PricingRuleType,
        description: valuesAsPricingRuleValues.description,
        discount: valuesAsPricingRuleValues.discount
          ? +valuesAsPricingRuleValues.discount
          : null,
        free: valuesAsPricingRuleValues.free
          ? +valuesAsPricingRuleValues.free
          : null,
        price: valuesAsPricingRuleValues.price
          ? +valuesAsPricingRuleValues.price
          : null,
        quantity: valuesAsPricingRuleValues.quantity
          ? +valuesAsPricingRuleValues.quantity
          : null,
        threshold: valuesAsPricingRuleValues.threshold
          ? +valuesAsPricingRuleValues.threshold
          : null,
      },
    });
    return { success: true };
  } catch {
    return { error: "resultNotOk" };
  }
};

export const deletePricingRule = async (id: string) => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { error: "you are not logged in" };
    }

    if (user.role !== "ADMIN") {
      return { error: "you don't have access" };
    }

    const pricingRule = await db.pricingRule.findUnique({
      where: { id },
    });
    if (!pricingRule) {
      return { error: "not found" };
    }
    await db.pricingRule.delete({
      where: { id: id },
    });
    return { success: "pricing rule deleted" };
  } catch {
    return { error: "resultNotOk" };
  }
};
