"use client";

import React from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ui
import { Button } from "@/components/Button/Button";
import { ArrowRight } from "lucide-react";

interface OptionResponseProps {
  question: string;
  index: number;
  option: string[];
  handleResponse: (option: number) => void;
  next: () => void;
}

export const OptionResponse: React.FC<OptionResponseProps> = ({
  handleResponse,
  question,
  index,
  option,
  next,
}) => {
  const formSchema = z.object({
    option: z.string().min(1),
  });

  const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      option: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    handleResponse(Number(values.option));
    next();
  };

  return (
    <div className="mx-auto flex w-full flex-col space-y-6 sm:w-[450px]">
      <div className="flex flex-col space-y-4 justify-start">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm font-medium">
            {index}. {question}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {option.map((option, index) => (
              <div key={index}>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    {...register("option")}
                    value={index}
                  />
                  <span className="ml-2 text-sm">{option}</span>
                </label>
              </div>
            ))}
          </div>

          <Button type="submit">
            Next <ArrowRight size={16} className="ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
};
