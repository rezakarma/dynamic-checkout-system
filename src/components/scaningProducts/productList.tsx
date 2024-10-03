"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import SyncLoader from "react-spinners/SyncLoader";
import { ScrollArea } from "../ui/scroll-area";

import ProductItem from "./productItem";
import { customProductInCart, Product, ProductInCart } from "@/types/cart.types";
import ProductListAction from "./productListActin";

interface ProductListProps {
  isPending: boolean;
  data: customProductInCart[] | Product[];
  type: "CartProduct" | "Product" | "Summray";
}
const ProductList = ({ isPending, data, type }: ProductListProps) => {
  return (
    <Card className={"w-4/5"}>
      <CardHeader></CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] ">
          {isPending && type === "Product" && (
            <div className="flex justify-center items-center pt-52 w-full h-full">
              <SyncLoader />
            </div>
          )}
          {isPending && data && data.length === 0 && type === "CartProduct" && (
            <div className="flex justify-center items-center pt-52 w-full h-full">
              <SyncLoader />
            </div>
          )}
          {isPending && data && data.length === 0 && type === "Summray" && (
            <div className="flex justify-center items-center pt-52 w-full h-full">
              <SyncLoader />
            </div>
          )}
          {data && data.length > 0 && (
            <div className="flex flex-col gap-3">
              {!isPending &&
                data &&
                type === "Product" &&
                data.map((product) => (
                  <ProductItem
                    type="Product"
                    product={product as customProductInCart}
                    key={product.id}
                  />
                ))}
              {type === "CartProduct" &&
                data.length > 0 &&
                data.map((product) => (
                  <ProductItem
                    count={product.count}
                    type="CartProduct"
                    product={product.product}
                    key={product.product.id}
                  />
                ))}

              {type === "Summray" &&
                data.length > 0 &&
                data.map((product) => (
                  <ProductItem
                    count={product.count}
                    type="Summray"
                    product={product.product}
                    productInCart={product as ProductInCart}
                    key={product.product.id}
                  />
                ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex gap-4 flex-col">
        {type === "CartProduct" && <ProductListAction />}
      </CardFooter>
    </Card>
  );
};

export default ProductList;
