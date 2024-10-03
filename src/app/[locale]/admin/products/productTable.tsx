"use client";
import { getAllProducts } from "@/actions/product.actions";
import { Product, columns } from "./columns";
import BeatLoader from "react-spinners/BeatLoader";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";

async function getData(): Promise<Product[]> {
  // Fetch data from your API here.

  const result = await getAllProducts("");

  if (result.error) {
    throw new Error(result.error);
  } else if (result.success) {
    return result.products;
  }
  return [];
}

export default function ProductTable() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["products"],
    queryFn: getData,
  });

  return (
    <div className="container mx-auto py-5">
      {isPending && (
        <div className="flex justify-center items-center w-full h-full">
          <BeatLoader />
        </div>
      )}
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
}
