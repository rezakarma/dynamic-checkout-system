import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Home() {
  const t = useTranslations("home");
  return (
    <main className="flex flex-col justify-center items-center mt-[10%] gap-5">
      <h1 className="text-7xl font-bold">{t("header")}</h1>
      <h6
        className="text-xl font-light
      "
      >
        {t("subheader")}
      </h6>
      <div className="flex justify-center items-center gap-3">
        <Link href="/scaning-products">
          <Button variant="default" size="lg">
            {t("button.getStart")}
            <ChevronsRight />
          </Button>
        </Link>
      </div>
    </main>
  );
}
