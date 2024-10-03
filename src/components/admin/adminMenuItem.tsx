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
    <Link href={href}>
      <Button
        variant={currentPath === href ? "default" : "ghost"}
        className="flex flex-row gap-3 justify-start items-center w-11/12"
      >
        {children}
        {t(text)}
      </Button>
    </Link>
  );
};

export default AdminMenuItem;
