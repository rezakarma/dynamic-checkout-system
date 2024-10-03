"use client";
import CheckoutSummary from "@/components/cart/checkoutSummary";
import ProductList from "@/components/scaningProducts/productList";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store/store";
import { customProductInCart } from "@/types/cart.types";
import { useSelector } from "react-redux";

const CartPage = () => {
  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const cartIsLoading = useSelector((state: RootState) => state.cart.isLoading);
  return (
    <div className="flex h-full">
      <div className="flex flex-col gap-4 w-1/2 items-center space-y-28">
        <ProductList
          type="Summray"
          data={cartProducts as customProductInCart[]}
          isPending={cartIsLoading}
        />
      </div>
      <Separator orientation="vertical" className="h-[630px]" />
      <CheckoutSummary />
    </div>
  );
};

export default CartPage;
