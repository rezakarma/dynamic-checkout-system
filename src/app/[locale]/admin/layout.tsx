"use client";
import AdminMenu from "@/components/admin/adminMenu";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const t = useTranslations("admin");

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="mx-4 py-2 flex flex-col gap-2">
        <h1 className="md:text-4xl font-bold xxs:text-lg xs:text-xl sm:text-2xl">
          {t("adminHeader")}
        </h1>
        <p className="xxs:hidden sm:block ">{t("adminDescription")}</p>
      </div>
      <Separator />
      <div className="flex w-full h-full">
        <AdminMenu />
        <div className="lg:w-5/6 md:w-3/4 sm:2/3">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
