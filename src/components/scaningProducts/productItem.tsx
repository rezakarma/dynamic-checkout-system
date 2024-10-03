"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Image } from "@nextui-org/react";
import { Product } from "@prisma/client";
import { removeProduct, addProduct } from "@/store/cart-slice";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useTransition } from "react";
import { applyPricingRules, PricingRuleResult } from "@/lib/pricingRules";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { customProductInCart } from "@/types/cart.types";
const placeHolderImage = process.env.NEXT_PUBLIC_IMAGE_PLACEHOLDR;
interface ProductItemProps {
  product: Product;
  type: "Product" | "CartProduct" | "Summray";
  count: number | null;
  productInCart: customProductInCart | null;
}
const ProductItem = ({
  product,
  type,
  count,
  productInCart,
}: ProductItemProps) => {
  const t = useTranslations("scanProduct");
  const tp = useTranslations("adminPricingRules");
  const tc = useTranslations("checkoutSummary");
  const tca = useTranslations("cart");

  const [ispendingDel, startTransitionDel] = useTransition();
  const [ispendingAdd, startTransitionAdd] = useTransition();
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const addItemHandler = () => {
    startTransitionAdd(() => {
      dispatch(addProduct({ productId: product.id, type: "byId" }));
    });
  };

  const removeItemHandler = () => {
    startTransitionDel(() => {
      dispatch(removeProduct(product.id));
    });
  };
  const clearCartIsLoading = useSelector(
    (state: RootState) => state.cart.isLoading
  );
  useEffect(() => {
    if (!clearCartIsLoading) {
    }
  }, [clearCartIsLoading]);

  const [pricingRulesResult, setPricingRulesResult] =
    useState<PricingRuleResult | null>(null);

  useEffect(() => {
    if (type === "Summray") {
      if(productInCart){

        const result = applyPricingRules(productInCart);
        setPricingRulesResult(result);
      }
    } else {
      setPricingRulesResult(null);
    }
  }, [type, productInCart]);

  return (
    <Card className="max-w-md">
      <CardContent className="flex items-center gap-4 pt-5">
        <Image
          alt="image"
          className="w-28 h-28"
          src={product.imageLink ? product.imageLink : placeHolderImage}
        />

        <div className="flex flex-col ">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="font-light">
            <span>{t("price")}: </span>
            <span>{product.sellPrice}</span>
          </p>
          <p className="font-light">
            <span>{t("brand")}: </span>
            <span>{product.brand}</span>
          </p>

          <p className="font-light gap-1 flex">
            <span>SKU: </span>
            <p className="font-light">{product.SKU}</p>
          </p>
          <p className="font-light">{product.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        {type === "Product" && (
          <Button
            className="w-full flex gap-2"
            disabled={ispendingAdd}
            onClick={addItemHandler}
          >
            {ispendingAdd && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <span>{t("addToCart")}</span>
            <ShoppingCart />
          </Button>
        )}
        {pricingRulesResult?.originalPrice && (
          <div className="flex flex-col w-full">
            <div className="flex bg-gray-50 rounded-lg justify-between px-4 py-2 w-full items-center">
              <span>{tca("subtotal")}: </span>
              <span>${pricingRulesResult.originalPrice}</span>
            </div>
            <div
              className="flex bg-gray-200 rounded-lg gap-2 justify-between px-4 py-2 w-full items-center"
              color="secondary"
            >
              <span>{tp("discount")}: </span>
              <span>${pricingRulesResult.discountAmount}</span>
            </div>
            <div className="flex gap-2 bg-gray-50 rounded-lg justify-between px-4 py-2 w-full items-center">
              <span>{tc("totalPrice")}: </span>
              <span>${pricingRulesResult.price}</span>
            </div>
            <div
              className="flex gap-2 bg-gray-200 rounded-lg justify-between px-4 py-2 w-full items-center"
              color="secondary"
            >
              <span>{tc("typeOfDiscount")}: </span>
              <span>{pricingRulesResult.pricingRuleType}</span>
            </div>
          </div>
        )}

        {(type === "CartProduct" || type === "Summray") && (
          <div className="flex gap-2 ">
            <Button onClick={addItemHandler} disabled={ispendingAdd}>
              {!ispendingAdd && <Plus />}
              {ispendingAdd && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
            </Button>
            <Button variant="outline">{count}</Button>
            <Button onClick={removeItemHandler} disabled={ispendingDel}>
              {!ispendingDel && <Minus />}
              {ispendingDel && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
            </Button>

            {/* <Button
              variant="ghost"
              className="text-destructive"
              disabled={ispendingDel}
            >
              <Trash2 />
            </Button> */}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductItem;
