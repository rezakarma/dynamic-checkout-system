"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { loginSchemaWithUsername } from "@/schema";
import { Link, useRouter } from "@/navigation";
import { login } from "@/actions/auth.actions";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const t = useTranslations("navbar");
  const tl = useTranslations("login");
  const tz = useTranslations("zodErrors");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchemaWithUsername>>({
    resolver: zodResolver(loginSchemaWithUsername, {
      errorMap: () => ({ message: tz("required") }),
    }),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchemaWithUsername>) {

    startTransition(async () => {
      const res = await login(values);
      if (res.error) {
        toast({ variant: "destructive", description: tz(res.error) });
        return;
      } else if (res.success) {
        router.push("/");
      }
    });
  }

  return (
    <div className="w-1/2 flex justify-center items-center">
      <Card className="min-w-[60%]">
        <CardHeader>
          <CardTitle>{t("login")}</CardTitle>
          <CardDescription>{tl("loginDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tl("username")}</FormLabel>
                    <FormControl>
                      <Input placeholder={tl("username")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tl("password")}</FormLabel>
                    <FormControl>
                      <Input placeholder={tl("password")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isPending}>
                {t("login")}
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="flex gap-2">
            {tl("goToSignup")}
            <Link
              className="text-blue-500 hover:text-blue-700 transition-all"
              href={"/signup"}
            >
              {t("signup")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
