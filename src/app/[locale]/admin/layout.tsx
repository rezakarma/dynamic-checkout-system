import AdminMenu from "@/components/admin/adminMenu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

const AdminLayout = ({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) => {
  const t = useTranslations("admin");

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="mx-4 py-2 flex flex-col gap-2">
        <h1 className="text-4xl font-bold">{t("adminHeader")}</h1>
        <p>{t("adminDescription")}</p>
      </div>
      <Separator />
      <div className="flex w-full h-full">
        <AdminMenu />
        <div className="w-4/5">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
