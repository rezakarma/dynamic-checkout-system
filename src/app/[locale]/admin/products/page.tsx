"use client";
import AddProduct from "@/components/admin/products/addProduct";

import { useTranslations } from "next-intl";
import ProductTable from "./productTable";

const AdminProductPage = () => {
  const t = useTranslations("admin");
  return (
    <div className="flex flex-col justify-center md:px-2 ">
      <div className="pt-5 pr-2 flex justify-between w-full">
        <h2 className="text-4xl font-bold">{t("products")}</h2>
        <AddProduct id={null} />
      </div>
      <ProductTable />
    </div>
  );
};

export default AdminProductPage;
