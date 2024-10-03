"use server";
import { db } from "@/lib/db";
import { couponCodesSchema } from "@/schema";
import { z } from "zod";

export const addCouponCode = async (
  values: z.infer<typeof couponCodesSchema>
) => {
  const validatedFields = couponCodesSchema.safeParse(values);

  if (!validatedFields) {
    return { error: "Invalid fields!" };
  }
  try {
    const codeExist = await db.couponCodes.findUnique({
      where: { code: values.code },
    });

    if (codeExist) {
      return { error: "code exist already" };
    }
    await db.couponCodes.create({
      data: {
        code: values.code,
        type: values.type,
        discount: +values.discount,
        quantity: +values.quantity,
        discountType: values.discountType,
        startDate: values.startDate,
        endDate: values.endDate,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.log("heere: ", error);
    return { error: "resultNotOk" };
  }
};

export const getCouponCode = async (code: string) => {
  try {
    const couponEXist = await db.couponCodes.findUnique({
      where: { code },
    });
    if (!couponEXist) {
      return { error: "not found" };
    }
    return { success: true, couponCode: couponEXist };
  } catch (error: any) {
    return { error: "resultNotOk" };
  }
};
