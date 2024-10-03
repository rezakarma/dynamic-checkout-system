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
import AddCouponCodesForm from "./addCouponCodesFrom";

const AddCouponCodes = ({ id }: { id: string | null }) => {
  const t = useTranslations("couponCodes");
  return (
    <Sheet >
      <SheetTrigger asChild>
        <Button className="flex items-center justify-center gap-2">
          {id ? <FilePenLine /> : <FilePlus />}
          {id ? t("editCouponCode") : t("addCouponCode")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] rounded-2xl sm:w-[540px] h-11/12 m-10">
        <SheetHeader className="mb-4">
          <SheetTitle>
            {id ? t("editCouponCode") : t("addCouponCode")}
          </SheetTitle>
          <SheetDescription>{t("couponCodeDescription")}</SheetDescription>
        </SheetHeader>
        <AddCouponCodesForm id={id ? id : null} />
      </SheetContent>
    </Sheet>
  );
};

export default AddCouponCodes;
