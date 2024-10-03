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
import { FilePenLine, PackagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import AddProductForm from "./addProductForm";

const AddProduct = ({ id = null }: { id: string | null }) => {
  const t = useTranslations("admin");
  const tp = useTranslations("adminProduct");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={id ? "secondary" : "default"}
          className="flex items-center justify-between gap-2"
        >
          {id ? <FilePenLine /> : <PackagePlus />}
          {id ? tp("edit") : t("product.add")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] rounded-2xl sm:w-[540px] h-11/12 m-10">
        <SheetHeader className="mb-4">
          <SheetTitle>{id ? tp("edit") : t("product.add")}</SheetTitle>
          <SheetDescription>{t("product.description")}</SheetDescription>
        </SheetHeader>
        <AddProductForm id={id ? id : null} />
      </SheetContent>
    </Sheet>
  );
};

export default AddProduct;
