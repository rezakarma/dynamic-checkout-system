"use server";

import { validateRequest } from "@/auth";
import { db } from "@/lib/db";
import { generateUniqueSKU, SKUGenerator } from "@/lib/utils";
import { PorductSchema } from "@/schema";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export async function checkSKUExists(sku: string) {
  const existingProduct = await db.product.findFirst({ where: { SKU: sku } });
  return existingProduct !== null;
}

export const addProduct = async (values: z.infer<typeof PorductSchema>) => {
  const validatedFields = PorductSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { user } = await validateRequest();
  if (!user) {
    return { error: "you are not logged in" };
  }

  if (user.role !== "ADMIN") {
    return { error: "you don't have access" };
  }

  try {
    let SKU = "";
    if (!values.SKU) {
      SKU = await generateUniqueSKU(
        SKUGenerator(values.name, values.brand, values.sellPrice)
      );
    } else {
      SKU = values.SKU;
      const SKUExist = await checkSKUExists(SKU);

      if (SKUExist) {
        return { error: "this SKU is already exist" };
      }
    }

    await db.product.create({
      data: {
        name: values.name,
        purchasePrice: +values.purchasePrice,
        brand: values.brand,
        quantity: +values.quantity,
        sellPrice: +values.sellPrice,
        description: values.description && values.description,
        SKU: SKU,
        pricingRules: {
          connect: values.pricingRulesId?.map((id) => ({ id })),
        },
      },
    });
    return { success: true };
  } catch {
    return { error: "resultNotOk" };
  }
};

export const getAllProducts = async (SKU: string) => {
  try {
    const where: Prisma.ProductWhereInput = {};

    if (SKU !== "") {
      where.OR = [{ SKU: { contains: SKU } }];
    }

    const products = await db.product.findMany({ where });
    return { success: true, products: products };
  } catch {
    return { error: "resultNotOk" };
  }
};

export const getProduct = async (id: string) => {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        pricingRules: true,
      },
    });
    if (!product) {
      return { error: "not found" };
    }
    return { success: true, product };
  } catch {
    return { error: "resultNotOk" };
  }
};

export const updateProduct = async (
  id: string,
  values: z.infer<typeof PorductSchema>
) => {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "you are not logged in" };
  }

  if (user.role !== "ADMIN") {
    return { error: "you don't have access" };
  }

  try {
    const validatedFields = PorductSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    let SKU = "";
    if (!values.SKU) {
      SKU = await generateUniqueSKU(
        SKUGenerator(values.name, values.brand, values.sellPrice)
      );
    } else {
      SKU = values.SKU;
    }
    const product = await db.product.findUnique({
      where: { id },
      include: {
        pricingRules: true,
      },
    });
    if (!product) {
      return { error: "not found" };
    }
    await db.product.update({
      where: { id: id },
      data: {
        name: values.name,
        purchasePrice: +values.purchasePrice,
        brand: values.brand,
        quantity: +values.quantity,
        sellPrice: +values.sellPrice,
        description: values.description && values.description,
        SKU: SKU,
        pricingRules: {
          disconnect: product.pricingRules.map((rule) => ({ id: rule.id })),
          connect: values.pricingRulesId?.map((id) => ({ id })),
        },
      },
    });
    return { success: true };
  } catch {
    return { error: "resultNotOk" };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { error: "you are not logged in" };
    }

    if (user.role !== "ADMIN") {
      return { error: "you don't have access" };
    }

    const product = await db.product.findUnique({
      where: { id },
      include: {
        pricingRules: true,
      },
    });
    if (!product) {
      return { error: "not found" };
    }
    await db.product.delete({
      where: { id: id },
    });
    return { success: "product", product };
  } catch {
    return { error: "resultNotOk" };
  }
};
