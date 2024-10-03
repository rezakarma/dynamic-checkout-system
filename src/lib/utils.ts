import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { checkSKUExists } from "@/actions/product.actions";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SKUGenerator(
  name: string,
  brand: string,
  price: string
): string {
  const firstNameTwoChars = name.substring(0, 2).toUpperCase();
  const firstBrandTwoChars = brand.substring(0, 2).toUpperCase();
  const firstPriceTwoChars = price.substring(0, 2).toUpperCase();

  return `${firstNameTwoChars}_${firstBrandTwoChars}_${firstPriceTwoChars}`;
}

export async function generateUniqueSKU(sku: string) {
  let uniqueSku = sku;
  while (await checkSKUExists(uniqueSku)) {
    const randomSuffix = Math.random().toString(36).substr(2, 4);
    uniqueSku = `${sku}${randomSuffix}`;
  }
  return uniqueSku;
}
