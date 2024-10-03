"use client";
import { NforX, PercentageDiscount, VolumePricing } from "@/schema";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useTransition, SetStateAction, Dispatch } from "react";
import { SheetClose } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PricingRule, PricingRuleType } from "@prisma/client";
import {
  addPricingRule,
  getPrcingRule,
  updatePricingRule,
} from "@/actions/pricingRule.actions";
import { useQueryClient } from "@tanstack/react-query";
const AddPricingRulesForm = ({
  id,
  setSheetOpen,
}: {
  id: string | null;
  setSheetOpen: Dispatch<SetStateAction<undefined | boolean>>;
}) => {
  const t = useTranslations("adminProduct");
  const tp = useTranslations("adminPricingRules");
  const te = useTranslations("error");
  const tz = useTranslations("zodErrors");
  const [isPending, startTransition] = useTransition();
  const [pricingRuleType, setPricingRuleType] = useState<
    PricingRuleType | null | undefined
  >();
  const queryClient = useQueryClient();
  const [typeSelectError, setTypeSelectError] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      const fetchPricingRule = async () => {
        const result = await getPrcingRule(id);
        if (result.error) {
          toast.error(result.error);
          return;
        } else if (result.success && result.prcingRule) {
          const pricingRule = result.prcingRule as PricingRule;
          setPricingRuleType(pricingRule.type);
          form.setValue("name", pricingRule.name);
          const emptyObjectOfPricingRule = getEmptyObjectFromZodSchema(
            result.prcingRule.type
          );
          Object.keys(emptyObjectOfPricingRule).forEach((key) => {
            // Check if the key exists in the data object
            if (pricingRule.hasOwnProperty(key)) {
              // Get the value from the data object
              const value = pricingRule[key];
              // Set the value in the form
              form.setValue(key, value?.toString());
            }
          });
        }
      };
      fetchPricingRule();
    }
  }, [id]);

  useEffect(() => {
    console.log("pricingRuleType ", pricingRuleType);
  }, [pricingRuleType]);

  function returnZodSchema(type: PricingRuleType | null | undefined) {
    if (type === PricingRuleType.NforX) {
      return NforX;
    } else if (type === PricingRuleType.VolumePricing) {
      return VolumePricing;
    } else if (type === PricingRuleType.PercentageDiscount) {
      return PercentageDiscount;
    }
    return NforX;
  }

  const getEmptyObjectFromZodSchema = useCallback(
    (type: PricingRuleType | null | undefined) => {
      const emptyObject = {};
      if (type === PricingRuleType.NforX) {
        for (const key in NforX.shape) {
          emptyObject[key] = "";
        }
      } else if (type === PricingRuleType.VolumePricing) {
        for (const key in VolumePricing.shape) {
          emptyObject[key] = "";
        }
      } else if (type === PricingRuleType.PercentageDiscount) {
        for (const key in PercentageDiscount.shape) {
          emptyObject[key] = "";
        }
      }
      return emptyObject;
    },
    []
  );
  const form = useForm<
    z.infer<typeof NforX | typeof VolumePricing | typeof PercentageDiscount>
  >({
    resolver: zodResolver(returnZodSchema(pricingRuleType), {
      errorMap() {
        return { message: tz("required") };
      },
    }),
    defaultValues: getEmptyObjectFromZodSchema(pricingRuleType),
  });

  useEffect(() => {
    if (pricingRuleType) {
      form.setValue("type", pricingRuleType);
      setTypeSelectError(false);
    }
  }, [pricingRuleType]);

  async function onSubmit(
    values: z.infer<
      typeof NforX | typeof VolumePricing | typeof PercentageDiscount
    >
  ) {
    console.log(values);
    startTransition(async () => {
      if (id) {
        const result = await updatePricingRule(id, values);
        if (result.success) {
          toast.success(tp("pricingRuleAdded"));
          queryClient.invalidateQueries({ queryKey: ["pricingRules"] });

          setSheetOpen(false);
        } else {
          toast.error(te("resultNotOk"));
        }
      } else {
        const result = await addPricingRule(values);
        if (result.success) {
          toast.success(tp("pricingRuleAdded"));
          queryClient.invalidateQueries({ queryKey: ["pricingRules"] });

          setSheetOpen(false);
        } else {
          toast.error(te("resultNotOk"));
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <ScrollArea className="h-[500px] w-full">
          <div className="flex flex-col gap-5 w-full px-1">
            <Select
              value={pricingRuleType ? pricingRuleType : ""}
              onValueChange={(value) => {
                setPricingRuleType(value as PricingRuleType);
              }}
            >
              <SelectTrigger className="w-fit mt-2">
                <SelectValue placeholder={tp("pricingRuleType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.keys(PricingRuleType).map((item) => (
                    <SelectItem value={item} key={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
              {typeSelectError && (
                <p className="text-destructive">{tp("typeSelectError")}</p>
              )}
            </Select>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tp("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={tp("name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tp("description")}</FormLabel>
                  <FormControl>
                    <Input placeholder={tp("description")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {pricingRuleType === PricingRuleType.NforX && (
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
                  name="price"
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
            )}
            {pricingRuleType === PricingRuleType.VolumePricing && (
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
                  name="free"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tp("free")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={tp("free")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {pricingRuleType === PricingRuleType.PercentageDiscount && (
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tp("threshold")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={tp("threshold")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tp("discount")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={tp("discount")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-5">
          <Button
            disabled={isPending}
            type="submit"
            onClick={() => {
              if (!pricingRuleType) {
                form.setError('type',{message:"type can't be empty"});
              }
            }}
          >
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

export default AddPricingRulesForm;
