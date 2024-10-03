import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, ScanBarcode } from "lucide-react";
import { useTransition } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "@/store/cart-slice";
interface ScanProduct {
  SKU: string;
  setSKU: (SKU: string) => void;
}
const ScanProduct = ({ SKU, setSKU }) => {
  const t = useTranslations("scanProduct");
  const dispatch = useDispatch();
  const [ispendingAdd, startTransitionAdd] = useTransition();
  const addItemHandler = () => {
    startTransitionAdd(() => {
      dispatch(addProduct({ productId: SKU, type: "SKU" }));
    });
  };
  return (
    <div className="flex flex-col w-fit items-center gap-1.5">
      <Label htmlFor="SKU" className="self-start">
        {t("enterSKU")}
      </Label>
      <div className="flex gap-2">
        <Input
          type="email"
          id="SKU"
          placeholder={t("enterSKU")}
          value={SKU}
          onChange={(e) => {
            setSKU(e.target.value);
          }}
        />
        <Button
          disabled={ispendingAdd}
          onClick={addItemHandler}
          className="flex gap-2"
        >
          {ispendingAdd && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

          <ScanBarcode />
          <p>{t("scan")}</p>
        </Button>
      </div>
    </div>
  );
};

export default ScanProduct;
