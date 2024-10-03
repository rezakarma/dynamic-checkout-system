"use client";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Link, usePathname } from "@/navigation";

interface AdminMenuItemProps {
  children: React.ReactNode;
  text: string;
  href: string;
}

const AdminMenuItem = ({ children, text, href }: AdminMenuItemProps) => {
  const t = useTranslations("admin");
  const currentPath = usePathname();

  return (
    <Link href={href} className="bg-white">
      <Button
        variant={currentPath === href ? "default" : "ghost"}
        className="flex flex-row gap-3 justify-start items-center w-11/12 xs:flex xxs:hidden"
      >
        {children}
        {t(text)}
      </Button>

      <Button
        variant={currentPath === href ? "default" : "ghost"}
        className=" flex-row gap-3 justify-start items-center w-11/12 hidden xs:hidden xxs:flex"
      >
        {children}
      </Button>
    </Link>
  );
};

export default AdminMenuItem;
