import {
  PricingRule,
  PricingRuleType,
  Product,
  ProductInCart,
} from "@prisma/client";

export interface PricingRuleResult {
  price: number;
  pricingRuleId: string | null;
  pricingRuleType: PricingRuleType | null;
  originalPrice: number | null;
  discountAmount: number | null;
}

export function applyPricingRules(
  productInCart: ProductInCart & {
    product: Product & { pricingRules: PricingRule[] };
  }
): PricingRuleResult {
  const { product, count } = productInCart;
  const { pricingRules } = product;

  let lowestPrice: number = product.sellPrice * count;
  let appliedPricingRuleId: string | null = null;
  let appliedPricingRuleType: PricingRuleType | null = null;
  let originalPrice: number | null = null;
  let discountAmount: number | null = null;

  pricingRules.forEach((pricingRule) => {
    let priceAfterRule: number;

    try {
      switch (pricingRule.type) {
        case PricingRuleType.NforX:
          priceAfterRule = calculateNForXPrice(
            product.sellPrice,
            count,
            pricingRule.quantity,
            pricingRule.price
          );
          break;
        case PricingRuleType.VolumePricing:
          priceAfterRule = calculateVolumePricing(
            product.sellPrice,
            count,
            pricingRule.quantity,
            pricingRule.free
          );
          break;
        case PricingRuleType.PercentageDiscount:
          priceAfterRule = calculatePercentageDiscount(
            product.sellPrice,
            count,
            pricingRule.threshold,
            pricingRule.discount
          );
          break;
        default:
          throw new Error(`Unsupported pricing rule type: ${pricingRule.type}`);
      }

      if (priceAfterRule < 0) {
        // If priceAfterRule is negative, skip this pricing rule
        return;
      }

      if (priceAfterRule < lowestPrice) {
        lowestPrice = priceAfterRule;
        appliedPricingRuleId = pricingRule.id;
        appliedPricingRuleType = pricingRule.type;
        originalPrice = product.sellPrice * count;
        discountAmount = originalPrice - lowestPrice;
      }
    } catch (error) {
      // If any error occurs during pricing rule calculation, skip this pricing rule
      return;
    }
  });

  return {
    price: lowestPrice,
    pricingRuleId: appliedPricingRuleId,
    pricingRuleType: appliedPricingRuleType,
    originalPrice,
    discountAmount,
  };
}

function calculateNForXPrice(
  sellPrice: number,
  count: number,
  quantity: number,
  price: number
): number {
  if (
    typeof sellPrice !== "number" ||
    typeof count !== "number" ||
    typeof quantity !== "number" ||
    typeof price !== "number"
  ) {
    throw new Error("Invalid input values");
  }

  if (sellPrice < 0 || count < 0 || quantity < 0 || price < 0) {
    throw new Error("Input values cannot be negative");
  }

  const sets = Math.floor(count / quantity);
  const remaining = count % quantity;
  console.log("NforXpice:", sets * price + remaining * sellPrice);
  return sets * price + remaining * sellPrice;
}

function calculateVolumePricing(
  sellPrice: number,
  count: number,
  quantity: number,
  free: number
): number {
  if (
    typeof sellPrice !== "number" ||
    typeof count !== "number" ||
    typeof quantity !== "number" ||
    typeof free !== "number"
  ) {
    throw new Error("Invalid input values");
  }

  if (sellPrice < 0 || count < 0 || quantity < 0 || free < 0) {
    throw new Error("Input values cannot be negative");
  }

  if (quantity + free === 0) {
    throw new Error("Cannot divide by zero");
  }

  const sets = Math.floor(count / (quantity + free));
  const remaining = count % (quantity + free);
  console.log(
    "calculateVolumePricing:",
    sets * quantity * sellPrice + remaining * sellPrice
  );

  return sets * quantity * sellPrice + remaining * sellPrice;
}

function calculatePercentageDiscount(
  sellPrice: number,
  count: number,
  threshold: number,
  discount: number
): number {
  if (
    typeof sellPrice !== "number" ||
    typeof count !== "number" ||
    typeof threshold !== "number" ||
    typeof discount !== "number"
  ) {
    throw new Error("Invalid input values");
  }

  if (sellPrice < 0 || count < 0 || threshold < 0 || discount < 0) {
    throw new Error("Input values cannot be negative");
  }

  if (count * sellPrice >= threshold) {
    console.log(
      "calculatePercentageDiscount:",
      count * sellPrice * (1 - discount / 100)
    );

    return count * sellPrice * (1 - discount / 100);
  }
  return count * sellPrice;
}
