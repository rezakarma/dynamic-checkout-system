"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Item } from "@radix-ui/react-select";

import { useQuery } from "@tanstack/react-query";
const languages = [
  { id: "1", name: "aa", type: "somet" },
  { id: "2", name: "aa", type: "somet" },
  { id: "3", name: "aa", type: "somet" },
  { id: "4", name: "aa", type: "somet" },
];
import { CircleDollarSign, Loader2, PackagePlus, Plus, Search } from "lucide-react";
import PricingRulesSelectorItem from "./pricingRulesSelectorIten";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import AddPricingRules from "../pricingRules/addPricingRules";
import { getAllPrcingRules } from "@/actions/pricingRule.actions";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PricingRulesIdSelectorProps {
  pricingRuleHandler: (isChecked: boolean | string, id: string) => void;
  pricingRules: string[] | [];
}
const PricingRulesIdSelector = ({
  pricingRuleHandler,
  pricingRules,
}: PricingRulesIdSelectorProps) => {
  const t = useTranslations("adminProduct");

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["PrcingRules"],
    queryFn: async () => {
      const result = await getAllPrcingRules();

      if (result.error) {
        throw new Error(result.error);
      } else if (result.success) {
        return result.PricingRules;
      }
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <CircleDollarSign />
          {t("addPricingRules")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] rounded-2xl sm:w-[540px] h-11/12 m-10 pt-10 flex flex-col">
        <SheetHeader className="">
          <SheetTitle>{t("addPricingRules")}</SheetTitle>
          <SheetDescription>{t("addPricingRuleDescription")}</SheetDescription>
          <div className="flex flex-col items-center gap-2 pt-2">
            <AddPricingRules />
            <div className="flex items-center w-full gap-2">
              <Input className="w-3/4 " placeholder={t("search")} />
              <Button className="w-1/4">{t("search")}</Button>
            </div>
            <Separator className="w-full" />
          </div>
        </SheetHeader>

        <ScrollArea className="h-[600px] w-full">


        {data &&
          !isPending &&
          data.map((item) => (
            <PricingRulesSelectorItem
            key={item.id}
            id={item.id}
            name={item.name}
            type={item.type}
            isChecked={pricingRules.includes(item.id)}
            onCheckedChange={pricingRuleHandler}
            />
          ))}
          </ScrollArea>

   
          <SheetClose asChild>
          <Button disabled={isPending}>
            {t("submit")}
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
          </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default PricingRulesIdSelector;
