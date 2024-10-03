"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { SKUGenerator } from "@/lib/utils";
import { PercentageDiscount, VolumePricing, NforX } from "@/schema";
import { PricingRuleType } from "@prisma/client";
import { z } from "zod";

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
    await db.pricingRule.create({
      data: {
        name: values.name,
        type: values.type as PricingRuleType,
        description: values.description,
        discount: +values.discount || null,
        free: +values.free || null,
        price: +values.price || null,
        quantity: +values.quantity || null,
        threshold: +values.threshold || null,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.log("heere: ", error);
    return { error: "resultNotOk" };
  }
};

export const getAllPrcingRules = async () => {
  try {
    const PricingRules = await db.pricingRule.findMany();
    return { success: true, PricingRules: PricingRules };
  } catch (error: any) {
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
  } catch (error: any) {
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
    const updatePricingRule = await db.pricingRule.update({
      where: { id: id },
      data: {
        name: values.name,
        type: values.type as PricingRuleType,
        description: values.description,
        discount: +values.discount || null,
        free: +values.free || null,
        price: +values.price || null,
        quantity: +values.quantity || null,
        threshold: +values.threshold || null,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.log("error of thisss:: ", error);
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
  } catch (error: any) {
    return { error: "resultNotOk" };
  }
};
