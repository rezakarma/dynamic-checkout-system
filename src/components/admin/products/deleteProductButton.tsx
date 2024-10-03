"use client";
import { useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/actions/product.actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { deletePricingRule } from "@/actions/pricingRule.actions";

const DeleteProductButton = ({
  id,
  type,
}: {
  id: string;
  type: "product" | "pricingRule";
}) => {
  const queryClient = useQueryClient();
  const productDleteHandler = async () => {
    let result;
    if (type === "product") {
      result = await deleteProduct(id);
    } else if (type === "pricingRule") {
      result = await deletePricingRule(id);
    }
    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(result.success);
      queryClient.invalidateQueries({ queryKey: ["pricingRules"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };
  const t = useTranslations("adminProduct");
  const tp = useTranslations("adminPrcingRules");
  return (
    <Button
      onClick={productDleteHandler}
      variant="destructive"
      className="flex gap-1 w-full"
    >
      <Trash2 />

      <span>{type === "product" ? t("delete") : tp("delete")}</span>
    </Button>
  );
};

export default DeleteProductButton;
