import { customProductInCart } from "@/types/cart.types";
import { applyPricingRules } from "./pricingRules";

export const calculateCartTotals = (products : customProductInCart[]) => {
  let originalTotalPrice = 0;
  let discountAmount = 0;
  let priceAfterDiscount = 0;

  products.forEach((product : customProductInCart) => {
    const pricingRulesResult = applyPricingRules(product);
    console.log(pricingRulesResult, ' dshdhf')
    originalTotalPrice += product.product.sellPrice * product.count;
    discountAmount +=pricingRulesResult.discountAmount ?? 0
      // pricingRulesResult.originalPrice ?? 0 - pricingRulesResult.price;
    priceAfterDiscount += pricingRulesResult.price;
  });

  return {
    originalTotalPrice,
    discountAmount,
    priceAfterDiscount,
  };
};
