"use client";
import CheckoutSummary from "@/components/cart/checkoutSummary";
import ProductList from "@/components/scaningProducts/productList";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";

const CartPage = () => {
  const cartProducts = useSelector((state) => state.cart.products);
  const cartIsLoading = useSelector((state) => state.cart.isLoading);
  return (
    <div className="flex h-full">
      <div className="flex flex-col gap-4 w-1/2 items-center space-y-28">
        <ProductList
          type="Summray"
          data={cartProducts}
          isPending={cartIsLoading}
        />
      </div>
      <Separator orientation="vertical" className="h-[630px]" />
      <CheckoutSummary />
    </div>
  );
};

export default CartPage;
