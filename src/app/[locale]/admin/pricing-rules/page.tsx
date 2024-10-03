import AddPricingRules from "@/components/admin/pricingRules/addPricingRules";
import PricingRulesTable from "./pricingRuleTable";
import { useTranslations } from "next-intl";

const PricingRulesPage = () => {
  const t= useTranslations('admin')
  return (
    <div className="flex flex-col justify-center">
      <div className=" pt-5 pr-2 flex justify-between w-full">
        <h2 className="text-4xl font-bold">{t("pricingRules")}</h2>
        <AddPricingRules id={null} />
      </div>

      <PricingRulesTable />
    </div>
  );
};

export default PricingRulesPage;
