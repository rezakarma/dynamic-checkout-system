"use client";
import { getAllProducts } from "@/actions/product.actions";
import ProductList from "@/components/scaningProducts/productList";
import ScanProduct from "@/components/scaningProducts/scanProduct";
import { Separator } from "@/components/ui/separator";
import useDebounce from "@/hooks/useDebounce";
import { RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const ScaningProductPage = () => {
  const [SKU, setSKU] = useState("");
  const debouncedSKU = useDebounce(SKU);

  const { isPending, data } = useQuery({
    queryKey: ["products", debouncedSKU],
    queryFn: async () => {
      const result = await getAllProducts(debouncedSKU);
      if (result.error) {
        throw new Error(result.error);
      } else if (result.success) {
        return result.products;
      }
    },
  });
  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const cartIsLoading = useSelector((state: RootState) => state.cart.isLoading);
  useEffect(() => {
    console.log(data, " injaa");
  }, [data]);
  return (
    <div className="flex h-full">
      <div className="flex flex-col gap-4 w-1/2 items-center space-y-28">
        <ProductList
          type="CartProduct"
          data={cartProducts}
          isPending={cartIsLoading}
        />
      </div>
      <Separator orientation="vertical" className="h-[630px]" />
      <div className="flex flex-col gap-4 w-1/2 items-center">
        <ScanProduct SKU={SKU} setSKU={setSKU} />
        <ProductList type="Product" data={data} isPending={isPending} />
      </div>
    </div>
  );
};

export default ScaningProductPage;
