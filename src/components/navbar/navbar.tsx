"use client";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import LanguageChanger from "../LanguageChanger";
import { Separator } from "@/components/ui/separator";
import { Link, usePathname, useRouter } from "@/navigation";
import { House, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "lucia";
import { signOut } from "@/actions/auth.actions";
import { toast } from "@/hooks/use-toast";

const Navbar = ({ locale }: { locale: string }) => {
  const t = useTranslations("navbar");
  const pathname = usePathname();
  // const { user } = useSession();
  const te = useTranslations("error");
  const [userData, setUser] = useState<User | null>();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const result = await fetch("/api/user");
      if (!result.ok) {
        toast({ variant: "destructive", description: te("resultNotOk") });
        return;
      }
      const responae = await result.json();
      console.log(responae, " responsee ");
      // const { user, session } = await validateRequest();
      setUser(responae.user);
    };
    getUser();
  }, [pathname]);

  const signOutUser = async () => {
    const res = await signOut();
    if (res.success) {
      router.replace("/login");
    }
  };

  let content = (
    <div className="flex flex-col w-screen py-4 gap-4">
      <div className="flex gap-2 justify-between mx-5">
        <LanguageChanger locale={locale} />
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
      <Separator />
    </div>
  );
  if (
    pathname === `/login` ||
    pathname === `/signup` ||
    pathname.startsWith("/admin")
  ) {
    content = (
      <div className="flex flex-col w-full py-4 gap-4 absolute top-0 left-0">
        <div className="flex gap-5 justify-end items-center mx-5">
          <Link href="/">
            <House color="black" />
          </Link>
          <LanguageChanger locale={locale} />
        </div>
      </div>
    );
  }

  if (userData && !pathname.startsWith("/admin")) {
    content = (
      <div className="flex flex-col w-screen py-4 gap-4">
        <div className="flex gap-2 justify-between mx-5">
          <Button onClick={signOutUser} variant="default">
            {t("logout")}
          </Button>

          <LanguageChanger locale={locale} />
        </div>
        <Separator />
      </div>
    );
  } else if (
    userData === null &&
    pathname !== `/login` &&
    pathname !== `/signup`
  ) {
    return (
      <div className="flex flex-col py-4 gap-4">
        <div className="flex gap-2 justify-between mx-5">
          <LanguageChanger locale={locale} />
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="secondary">{t("login")}</Button>
            </Link>
            <Link href="/signup">
              <Button variant="default">{t("signup")}</Button>
            </Link>
          </div>
        </div>
        <Separator />
      </div>
    );
  }

  return <>{content}</>;
};

export default Navbar;
