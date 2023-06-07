"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/Form/Form";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";

import useAppwrite from "@/store/AppwriteStore";
import { useAlert } from "@/components/AlertProvider/AlertProvider";

export const LoginForm = () => {
  const { login, authLoading } = useAppwrite();
  const { errorAlert } = useAlert();
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // useEffect(() => {
  //   if (me) {
  //     router.push("/dashboard");
  //   }
  // }, [me, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await login(values, () => {
        router.push("/dashboard");
      });
    } catch (error) {
      errorAlert("Uh oh! Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormControl>
                <Input placeholder="john.doe@gmail.com" {...field} />
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
              <FormControl>
                <Input placeholder="********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-6">
          <Button disabled={authLoading} type="submit">
            {authLoading ? <p>Loading ...</p> : <p>Login</p>}
          </Button>
        </div>
      </form>
    </Form>
  );
};
