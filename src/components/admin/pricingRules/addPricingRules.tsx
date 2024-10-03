"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilePenLine, FilePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import AddPricingRulesForm from "./addPricingRulesForm";
import { useState } from "react";

const AddPricingRules = ({ id }: { id: string | null }) => {
  const t = useTranslations("adminPricingRules");
  const [sheetOpen, setSheetOpen] = useState<boolean | undefined>();
  return (
    <Sheet open={sheetOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center justify-center gap-2">
          {id ? <FilePenLine /> : <FilePlus />}
          {id ? t("editPricingRules") : t("addPricingRules")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] rounded-2xl sm:w-[540px] h-11/12 m-10">
        <SheetHeader className="mb-4">
          <SheetTitle>
            {id ? t("editPricingRules") : t("addPricingRules")}
          </SheetTitle>
          <SheetDescription>{t("pricingRulesDescription")}</SheetDescription>
        </SheetHeader>
        <AddPricingRulesForm id={id ? id : null} setSheetOpen={setSheetOpen} />
      </SheetContent>
    </Sheet>
  );
};

export default AddPricingRules;
