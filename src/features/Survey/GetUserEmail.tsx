"use client";

import useSurvey from "@/store/SurveyStore";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/Button/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/Form/Form";
import { Input } from "@/components/Input/Input";
import { ArrowRight } from "lucide-react";

interface GetUserEmailProps {
  next: () => void;
}

export const GetUserEmail: React.FC<GetUserEmailProps> = ({ next }) => {
  const { setUserEmail } = useSurvey();
  const formSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setUserEmail(values.email);
    next();
  };

  return (
    <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-4 text-center justify-center">
        <h1 className="text-2xl font-semibold tracking-tight">Nexus</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to proceed
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="john.doe@gmail.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6">
              <Button type="submit">
                Next <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
