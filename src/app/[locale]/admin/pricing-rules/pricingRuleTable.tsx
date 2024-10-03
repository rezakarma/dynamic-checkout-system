"use client";
import { PricingRule, columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { getAllPrcingRules } from "@/actions/pricingRule.actions";
import BeatLoader from "react-spinners/BeatLoader";

async function getData(): Promise<PricingRule[]> {
  // Fetch data from your API here.

  const result = await getAllPrcingRules();

  if (result.error) {
    throw new Error(result.error);
  } else if (result.success) {
    return result.PricingRules;
  }
  return [];
}

export default function PricingRulesTable() {
  const { isPending, data } = useQuery({
    queryKey: ["pricingRules"],
    queryFn: getData,
  });

  return (
    <div className="container mx-auto xs:py-5 xxs:pb-10 sm:pb-0 md:px-2">
      {isPending && (
        <div className="flex justify-center items-center w-full h-full">
          <BeatLoader />
        </div>
      )}
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
}
