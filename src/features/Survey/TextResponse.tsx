"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/Button/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Form/Form";
import { Input } from "@/components/Input/Input";
import { ArrowRight } from "lucide-react";

interface TextResponseProps {
  question: string;
  index: number;
  handleResponse: (text: string) => void;
  next: () => void;
}

export const TextResponse: React.FC<TextResponseProps> = ({
  handleResponse,
  question,
  next,
  index,
}) => {
  const formSchema = z.object({
    text: z.string().min(1).max(100),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    handleResponse(values.text);
    next();
  };

  return (
    <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[450px]">
      <div className="flex flex-col space-y-4 justify-start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-4">
                    <FormLabel className="font-medium">
                      {index}. {question}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit">
              Next <ArrowRight size={16} className="ml-2" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
