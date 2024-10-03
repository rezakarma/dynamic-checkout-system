import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Code } from "@nextui-org/code";
import { Separator } from "../ui/separator";
import CouponCode from "./couponCode";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { calculateCartTotals } from "@/lib/calculateCartTotals";
import React, { useCallback, useEffect, useReducer } from "react";
import { RootState } from "@/store/store";
const initialState = {
  originalTotalPrice: 0,
  discountAmount: 0,
  priceAfterDiscount: 0,
  discountFromCoupon: 0,
};
interface Action<T> {
  type: string;
  payload: T;
}

const reducer = (state: typeof initialState, action: Action<number>) => {
  switch (action.type) {
    case "SET_ORIGINAL_PRICE":
      return { ...state, originalTotalPrice: action.payload };
    case "SET_DISCOUNT_AMOUNT":
      return { ...state, discountAmount: action.payload };
    case "SET_PRICE_AFTER_DISCOUNT":
      return { ...state, priceAfterDiscount: action.payload };
    case "SET_DISCOUNT_FROM_COUPON":
      return { ...state, discountFromCoupon: action.payload };
    default:
      return state;
  }
};
const CheckoutSummary = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const t = useTranslations("cart");
  const tc = useTranslations("couponCodes");
  const tp = useTranslations("adminPricingRules");

  const products = useSelector((state: RootState) => state.cart.products);
  const couponCode = useSelector((state: RootState) => state.cart.couponCode);
  const calculateCartTotalsMemoized = useCallback(calculateCartTotals, []);

  // const { originalTotalPrice, discountAmount, priceAfterDiscount } = useMemo(
  //   () => calculateCartTotalsMemoized(products),
  //   [products, calculateCartTotalsMemoized]
  // );

  useEffect(() => {
    const { originalTotalPrice, discountAmount, priceAfterDiscount } =
      calculateCartTotalsMemoized(products);

    console.log(
      originalTotalPrice,
      discountAmount,
      priceAfterDiscount,
      " fgfg"
    );
    if (couponCode) {
      if (couponCode.discountType === "fixAmount") {
        const newPriceAfterDiscount = priceAfterDiscount - couponCode.discount;
        const newDiscountAmount = discountAmount + couponCode.discount;
        dispatch({
          type: "SET_DISCOUNT_AMOUNT",
          payload: Math.max(0, newDiscountAmount),
        });
        dispatch({
          type: "SET_PRICE_AFTER_DISCOUNT",
          payload: Math.max(0, newPriceAfterDiscount),
        });
        dispatch({
          type: "SET_DISCOUNT_FROM_COUPON",
          payload: Math.max(0, couponCode.discount),
        });

        dispatch({
          type: "SET_ORIGINAL_PRICE",
          payload: Math.max(0, originalTotalPrice),
        });
      } else if (couponCode.discountType === "percentage") {
        const newPriceAfterDiscount =
          priceAfterDiscount * (1 - couponCode.discount / 100);
        const discountAmount = priceAfterDiscount - newPriceAfterDiscount;
        const newDiscountAmount = discountAmount + discountAmount;
        dispatch({
          type: "SET_DISCOUNT_AMOUNT",
          payload: Math.max(0, newDiscountAmount),
        });
        dispatch({
          type: "SET_PRICE_AFTER_DISCOUNT",
          payload: Math.max(0, newPriceAfterDiscount),
        });
        dispatch({
          type: "SET_DISCOUNT_FROM_COUPON",
          payload: Math.max(0, discountAmount),
        });
        dispatch({
          type: "SET_ORIGINAL_PRICE",
          payload: Math.max(0, originalTotalPrice),
        });
      }
      return;
    }

    dispatch({
      type: "SET_ORIGINAL_PRICE",
      payload: originalTotalPrice ? originalTotalPrice : 0,
    });
    dispatch({
      type: "SET_DISCOUNT_AMOUNT",
      payload: discountAmount ? discountAmount : 0,
    });
    dispatch({
      type: "SET_PRICE_AFTER_DISCOUNT",
      payload: priceAfterDiscount ? priceAfterDiscount : 0,
    });

    console.log(
      originalTotalPrice,
      discountAmount,
      priceAfterDiscount,
      " gggfg"
    );
  }, [products, calculateCartTotalsMemoized, couponCode]);

  return (
    <div className="w-1/2 h-full flex justify-center items-center">
      <Card className="w-4/5">
        <CardHeader>
          <CardTitle>{t("checkoutSummary")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <Code
            size="md"
            className="flex justify-between px-4 py-2 items-center"
          >
            <span>{t("subtotal")}</span>
            <span>${state.originalTotalPrice}</span>
          </Code>
          <Code
            size="md"
            color="secondary"
            className="flex justify-between px-4 py-2 items-center"
          >
            <span>{tp("discount")}</span>
            <span>${state.discountAmount}</span>
          </Code>
          <Code
            size="md"
            className="flex justify-between px-4 py-2 items-center"
          >
            <span>{t("tax")}</span>
            <span>$0.00</span>
          </Code>
          <Separator orientation="horizontal" className="my-4" />
          <div className="flex flex-col gap-5">
            <CouponCode />
            {couponCode && (
              <div>
                <Code
                  size="md"
                  className="flex justify-between px-4 py-2 items-center"
                >
                  <span>{tc("code")}</span>
                  <span>{couponCode?.code}</span>
                </Code>
                <Code
                  size="md"
                  color="secondary"
                  className="flex justify-between px-4 py-2 items-center"
                >
                  <span>{tp("discount")}</span>
                  <span>${state.discountFromCoupon}</span>
                </Code>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 w-full">
          <Separator orientation="horizontal" className="my-4" />
          <Code
            size="lg"
            color="secondary"
            className="flex justify-between px-4 py-2 w-full items-center"
          >
            <span className="text-2xl font-extrabold">{t("totalPayable")}</span>
            <span className="text-2xl font-extrabold">
              {state.priceAfterDiscount}
            </span>
          </Code>
          <Button className="w-full">${state.priceAfterDiscount}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default React.memo(CheckoutSummary);
