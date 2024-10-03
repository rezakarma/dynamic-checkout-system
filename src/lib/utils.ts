
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function SKUGenerator(name: string, brand: string, price: string): string {
  const firstNameTwoChars = name.substring(0, 2).toUpperCase();
  const firstBrandTwoChars = brand.substring(0, 2).toUpperCase();
  const firstPriceTwoChars = price.substring(0, 2).toUpperCase();

  return `${firstNameTwoChars}_${firstBrandTwoChars}_${firstPriceTwoChars}`;
}
