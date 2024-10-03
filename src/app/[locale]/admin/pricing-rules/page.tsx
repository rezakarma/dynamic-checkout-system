import AddPricingRules from "@/components/admin/pricingRules/addPricingRules";
import PricingRulesTable from "./pricingRuleTable";
import { useTranslations } from "next-intl";

const PricingRulesPage = () => {
  const t= useTranslations('admin')
  return (
    <div className="flex flex-col justify-center md:px-2 ">
      <div className=" xs:pt-5 xs:pr-2 flex justify-between w-full xxs:pr-0 xxs:justify-between xxs:mx-2 xxs:pt-8">
        <h2 className="xxs:text-xl xs:text-2xl font-bold ">{t("pricingRules")}</h2>
        <AddPricingRules id={null} />
      </div>

      <PricingRulesTable />
    </div>
  );
};

export default PricingRulesPage;
