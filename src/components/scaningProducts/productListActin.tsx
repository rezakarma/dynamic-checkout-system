"use client";
import { Link } from "@/navigation";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { cartSliceAction, clearCart } from "@/store/cart-slice";
import { Loader2 } from "lucide-react";

const ProductListAction = () => {
  const t = useTranslations("adminProduct");
  const ts = useTranslations("scanProduct");
  const clearCartIsLoading = useSelector(
    (state) => state.cart.isLoadingClearCart
  );

  const dispatch = useDispatch();
  const clearCartHandler = () => {
    dispatch(clearCart());
  };
  return (
    <>
      <Link href="/cart" className="w-full">
        <Button className="w-full">{t("submit")}</Button>
      </Link>
      <Button
        onClick={clearCartHandler}
        disabled={clearCartIsLoading}
        className="w-full"
        variant="secondary"
      >
        {clearCartIsLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {ts("clearShoppingCart")}
      </Button>
    </>
  );
};

export default ProductListAction;
