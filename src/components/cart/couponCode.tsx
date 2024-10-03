"use client";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { applyCouponCode } from "@/store/cart-slice";
import { useDispatch } from "react-redux";
const CouponCode = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const t = useTranslations("cart");
  const ta = useTranslations("adminProduct");

  const dispatch = useDispatch();
  const applyCouponCodeHandler = () => {
    if (couponCode) {
      dispatch(applyCouponCode(couponCode));
      setCouponCode("");
    }
  };
  return (
    <div className="flex w-full max-w-sm items-end gap-1.5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="CouponCode:">{t("CouponCode")}</Label>
        <Input
          type="text"
          id="CouponCode"
          placeholder={t("CouponCode")}
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
      </div>
      <Button onClick={applyCouponCodeHandler}>{ta("submit")}</Button>
    </div>
  );
};

export default CouponCode;
