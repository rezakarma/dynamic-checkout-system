
import AddProduct from "@/components/admin/products/addProduct";
import ProductTable from "./productTable";
import { validateRequest } from "@/auth";
import { redirect } from "@/navigation";
import { getTranslations } from "next-intl/server";

const AdminProductPage = async () => {
  const { user } = await validateRequest();
  if (!user || user?.role !== "ADMIN") {
    return redirect("/");
  }
  const t =await getTranslations("admin");
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
