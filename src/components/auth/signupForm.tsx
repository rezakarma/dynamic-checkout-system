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
import { signupClientSchema } from "@/schema";
import { Link, useRouter } from "@/navigation";
import { isEqual } from "lodash";
import { signUp } from "@/actions/auth.actions";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

const SignupForm = () => {
  const t = useTranslations("navbar");
  const tl = useTranslations("login");
  const tz = useTranslations("zodErrors");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof signupClientSchema>>({
    resolver: zodResolver(signupClientSchema, {
      errorMap(issue, ctx) {
        let message;

        if (isEqual(issue.path, ["email"])) {
          message = tz("email");
        } else if (isEqual(issue.path, ["password"])) {
          message = tz("password");
        } else if (isEqual(issue.path, ["userName"])) {
          message = tz("username");
        } else if (isEqual(issue.path, ["confirmPassword"])) {
          message = tz("confirmPassword");
        }

        return { message: message || ctx.defaultError };
      },
    }),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupClientSchema>) {
    console.log(values);
    startTransition(async () => {
      const res = await signUp(values);
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
          <CardTitle>{t("signup")}</CardTitle>
          <CardDescription>{tl("signupDescription")}</CardDescription>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tl("email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={tl("email")}
                        {...field}
                      />
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
                      <Input
                        type="password"
                        placeholder={tl("password")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tl("confirmPassword")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={tl("confirmPassword")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isPending}>
                {t("signup")}
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="flex gap-2">
            {tl("goToLogin")}
            <Link
              className="text-blue-500 hover:text-blue-700 transition-all"
              href={"/login"}
            >
              {t("login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupForm;
