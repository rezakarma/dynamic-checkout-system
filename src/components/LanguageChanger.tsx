"use client";
import { useRouter, usePathname } from "@/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChangeEvent } from "react";

type LanguageChangerProps = {
  locale: string;
};

export default function LanguageChanger({ locale }: LanguageChangerProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (value: string) => {
    router.push(pathname, { locale: value });
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[50px] xs:w-[100px] md:[180px] ">
        <SelectValue placeholder="language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
        {/* <SelectItem value="fr">french</SelectItem> */}
        <SelectItem value="fa">فارسی</SelectItem>
      </SelectContent>
    </Select>
  );
}
