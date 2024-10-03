"use client";
import { couponCodesSchema } from "@/schema";
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
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { SheetClose } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fromDate } from "@internationalized/date";
import { DateInput } from "@nextui-org/react";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CouponCodeType, DiscountType } from "@prisma/client";
import { addCouponCode } from "@/actions/couponCode.action";
const AddCouponCodesForm = ({
  id,
  setSheetOpen,
}: {
  id: string | null;
  setSheetOpen: Dispatch<SetStateAction<undefined | boolean>>;
}) => {
  const t = useTranslations("adminProduct");
  const te = useTranslations("error");
  const tz = useTranslations("zodErrors");
  const tc = useTranslations("couponCodes");
  const tp = useTranslations("adminPricingRules");
  const [isPending, startTransition] = useTransition();

  const [couponCodeType, setCouponCodeType] = useState<
    CouponCodeType | undefined | null
  >();
  const [discountType, setDiscountType] = useState<
    DiscountType | undefined | null
  >();

  const [typeSelectError, setTypeSelectError] = useState<boolean>(false);
  const [discountTypeSelectError, setDiscountTypeSelectError] =
    useState<boolean>(false);

  useEffect(() => {
    if (couponCodeType) {
      form.setValue("type", couponCodeType);
      setTypeSelectError(false);
    }
  }, [couponCodeType]);

  useEffect(() => {
    if (discountType) {
      form.setValue("discountType", discountType);
      setDiscountTypeSelectError(false);
    }
  }, [discountType]);

  const form = useForm<z.infer<typeof couponCodesSchema>>({
    resolver: zodResolver(couponCodesSchema, {
      errorMap() {
        return { message: tz("required") };
      },
    }),
    defaultValues: {
      code: "",
      type: undefined,
      discountType: undefined,
      quantity: "",
      startDate: undefined,
      endDate: undefined,
      discount: "",
    },
  });
  const queryClient = useQueryClient();
  //   useEffect(() => {
  //     if (id) {
  //       const fetchProduct = async () => {
  //         const result = await getProduct(id);
  //         if (result.error) {
  //           return;
  //         } else if (result.success && result.product) {
  //           const {
  //             name,
  //             brand,
  //             purchasePrice,
  //             sellPrice,
  //             quantity,
  //             SKU,
  //             description,
  //             pricingRules,
  //           } = result.product;

  //           form.setValue("name", name);
  //           form.setValue("brand", brand);
  //           form.setValue("purchasePrice", purchasePrice.toString());
  //           form.setValue("sellPrice", sellPrice.toString());
  //           form.setValue("quantity", quantity.toString());
  //           form.setValue("SKU", SKU);
  //           form.setValue("description", description ?? "");
  //           const pricingRulesId = pricingRules.map((item) => item.id);
  //           console.log(pricingRulesId, " hereee");
  //           setPricingRules(pricingRulesId);
  //         }
  //       };

  //       fetchProduct();
  //     }
  //   }, [id]);

  //   useEffect(() => {
  //     form.setValue("pricingRulesId", pricingRules);
  //   }, [pricingRules]);

  async function onSubmit(values: z.infer<typeof couponCodesSchema>) {
    console.log(values);

    startTransition(async () => {
      if (id) {
        // const result = await updateCouponCode(id, values);
        // if (result.success) {
        //   queryClient.invalidateQueries({ queryKey: ["couponCodes"] });
        //   setSheetOpen(false);
        //   toast.success("coupon code added");
        // } else {
        //   toast.error(te("resultNotOk"));
        // }
      } else {
        const result = await addCouponCode(values);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ["couponCodes"] });
          toast.success("coupon code added");
          setSheetOpen(false);
        } else {
          toast.error(te("resultNotOk"));
        }
      }
    });
  }

  useEffect(() => {
    if (form.formState.errors) {
      console.log(form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <ScrollArea className="h-[500px] w-full pb-2">
          <div className="flex flex-col gap-5 w-full px-1">
            <div className="flex gap-2">
              <div>
                <Select
                  value={couponCodeType ? couponCodeType as string: undefined}
                  onValueChange={(value) => {
                    setCouponCodeType(value as CouponCodeType);
                  }}
                >
                  <SelectTrigger className="w-fit mt-2">
                    <SelectValue placeholder={tc("couponCodeType")} />
                    {!couponCodeType && tc("couponCodeType")}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.keys(CouponCodeType).map((item) => (
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
              </div>
              <div>
                <Select
                  value={discountType ? discountType as string : undefined}
                  onValueChange={(value) => {
                    setDiscountType(value as DiscountType);
                  }}
                >
                  <SelectTrigger className="w-fit mt-2">
                    <SelectValue placeholder={tc("discountType")} />

                    {!discountType && tc("discountType")}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.keys(DiscountType).map((item) => (
                        <SelectItem value={item} key={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                  {discountTypeSelectError && (
                    <p className="text-destructive">{tp("typeSelectError")}</p>
                  )}
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tc("code")}</FormLabel>
                    <FormControl>
                      <Input placeholder={tc("code")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
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
            </div>
            {couponCodeType === "expiry" && (
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{tc("from")}</FormLabel>
                      <DateInput
                        label="Start Date"
                        value={field.value ? fromDate(field.value, "") : undefined}
                        onChange={(e) => {
                          field.onChange(e.toDate());
                          console.log(e.toDate().toISOString());
                        }}
                        labelPlacement="outside"
                        endContent={
                          <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{tc("until")}</FormLabel>
                      <DateInput
                        label="End Date"
                        value={field.value ? fromDate(field.value,'') : undefined}
                        onChange={(e) => field.onChange(e.toDate())}
                        labelPlacement="outside"
                        isRequired={false}
                        endContent={
                          <CalendarIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                      />
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
              console.log("runnnnn");
              console.log(couponCodeType, discountType);
              if (!couponCodeType) {
                setTypeSelectError(true);
              }

              if (!discountType) {
                setDiscountTypeSelectError(true);
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

export default AddCouponCodesForm;
