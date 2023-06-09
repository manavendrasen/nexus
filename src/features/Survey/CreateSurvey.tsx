"use client";

import React from "react";

// hooks
import useSurvey from "@/store/SurveyStore";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/AlertProvider/AlertProvider";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// utils
import { customAlphabet } from "nanoid";

// ui
import { Button } from "@/components/Button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Form/Form";
import { Input } from "@/components/Input/Input";
import { Plus } from "lucide-react";

interface CreateSurveyProps {}

export const CreateSurvey: React.FC<CreateSurveyProps> = ({}) => {
  const { setSurvey, createSurvey, loading } = useSurvey();
  const router = useRouter();
  const { successAlert } = useAlert();
  const formSchema = z.object({
    title: z.string().min(5).max(100),
    desc: z.string().min(5).max(100),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const nanoid = customAlphabet("0123456789", 6);
    const newSurvey = {
      slug: nanoid(),
      title: values.title,
      desc: values.desc,
      status: "DRAFT",
    };
    createSurvey(newSurvey, () => {
      successAlert("Draft survey created! You can now add questions to it");
      router.push(`/survey/${newSurvey.slug}`);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={loading}>
          <Plus size={16} /> <p className="w-max ml-2">Add New</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Survey</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-3 mt-2 mb-4">
                    <FormLabel>Survey Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-3 mt-2 mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
