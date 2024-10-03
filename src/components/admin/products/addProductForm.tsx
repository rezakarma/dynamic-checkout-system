"use client";
import { PorductSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useState,
  useTransition,
} from "react";
import { SheetClose } from "@/components/ui/sheet";
import PricingRulesIdSelector from "./pricingRulesSelector";
import { Label } from "@/components/ui/label";
import {
  addProduct,
  getProduct,
  updateProduct,
} from "@/actions/product.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
const AddProductForm = ({
  id,
}: {
  id: string | null;
}) => {
  const t = useTranslations("adminProduct");
  const tz = useTranslations("zodErrors");
  const [pricingRules, setPricingRules] = useState<string[] | []>([]);
  const [autoSKU, setAutoSKU] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof PorductSchema>>({
    resolver: zodResolver(PorductSchema, {
      errorMap() {
        return { message: tz("required") };
      },
    }),
    defaultValues: {
      name: "",
      brand: "",
      purchasePrice: "",
      sellPrice: "",
      quantity: "",
      SKU: "",
      pricingRulesId: pricingRules,
      description: "",
      imageLink: "",
    },
  });
  const queryClient = useQueryClient();
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const result = await getProduct(id);
        if (result.error) {
          return;
        } else if (result.success && result.product) {
          const {
            name,
            brand,
            purchasePrice,
            sellPrice,
            quantity,
            SKU,
            description,
            pricingRules,
          } = result.product;

          form.setValue("name", name);
          form.setValue("brand", brand);
          form.setValue("purchasePrice", purchasePrice.toString());
          form.setValue("sellPrice", sellPrice.toString());
          form.setValue("quantity", quantity.toString());
          form.setValue("SKU", SKU);
          form.setValue("description", description ?? "");
          const pricingRulesId = pricingRules.map((item) => item.id);
          console.log(pricingRulesId, " hereee");
          setPricingRules(pricingRulesId);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const pricingRuleHandler = (isCheckhed: boolean | string, id: string) => {
    if (isCheckhed === true) {
      setPricingRules((PRids) => [...PRids, id]);
    } else if (isCheckhed === false) {
      setPricingRules((PRids) => PRids?.filter((PRid) => PRid !== id));
    }
  };

  useEffect(() => {
    form.setValue("pricingRulesId", pricingRules);
  }, [pricingRules]);

  useEffect(() => {
    if (autoSKU && !id) {
      form.setValue("SKU", "");
    }
  }, [autoSKU]);

  async function onSubmit(values: z.infer<typeof PorductSchema>) {
    console.log(values);

    startTransition(async () => {
      if (id) {
        const result = await updateProduct(id, values);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          toast.success(t("productAdded"));
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await addProduct(values);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          toast.success(t("productAdded"));
        } else {
          toast.error(result.error);
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <ScrollArea className="h-[450px] w-full py-3">
          <div className="flex flex-col gap-5 w-full px-1 ">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("name")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("brand")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("name")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("purchasePrice")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("purchasePrice")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("sellPrice")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("sellPrice")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("quantity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("quantity")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("imageLink")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("imageLink")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <PricingRulesIdSelector
              pricingRuleHandler={pricingRuleHandler}
              pricingRules={pricingRules}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("description")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Switch
                  id={t("autoSKU")}
                  checked={autoSKU}
                  onCheckedChange={setAutoSKU}
                />
                <Label htmlFor="airplane-mode">{t("autoSKU")}</Label>
              </div>
              <FormField
                control={form.control}
                name="SKU"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("SKU")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("SKU")}
                        {...field}
                        disabled={autoSKU}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-5">
          <Button disabled={isPending} type="submit">
            {t("submit")}
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
          <SheetClose asChild>
            <Button variant={"outline"} disabled={isPending}>
              {t("cancel")}
            </Button>
          </SheetClose>
        </div>
      </form>
    </Form>
  );
};

export default AddProductForm;
