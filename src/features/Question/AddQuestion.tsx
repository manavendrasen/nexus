"use client";

import { useAlert } from "@/components/AlertProvider/AlertProvider";
import { Button } from "@/components/Button/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog/Dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/Form/Form";
import { Input } from "@/components/Input/Input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Tabs/Tabs";
import useSurvey from "@/store/SurveyStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface AddQuestionProps {}

export const AddQuestion: React.FC<AddQuestionProps> = ({}) => {
  const { addQuestion, questions, createQuestion } = useSurvey();
  const { successAlert } = useAlert();
  const objectiveFormSchema = z.object({
    text: z.string().min(5).max(100),
    option1: z.string().min(3),
    option2: z.string().min(3),
    option3: z.string().min(3),
    option4: z.string().min(3),
  });

  const objectiveForm = useForm<z.infer<typeof objectiveFormSchema>>({
    resolver: zodResolver(objectiveFormSchema),
    defaultValues: {
      text: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
    },
  });

  // const textFormSchema = z.object({
  //   text: z.string().min(5).max(100),
  // });

  // const textForm = useForm<z.infer<typeof textFormSchema>>({
  //   resolver: zodResolver(textFormSchema),
  //   defaultValues: {
  //     text: "",
  //   },
  // });

  const onSubmitObjective = async (
    values: z.infer<typeof objectiveFormSchema>
  ) => {
    // TODO: add question mark
    addQuestion({
      index: questions.length + 1,
      type: "OPTION",
      text: values.text,
      options: [values.option1, values.option2, values.option3, values.option4],
    });

    createQuestion({
      index: questions.length + 1,
      type: "OPTION",
      text: values.text,
      options: [values.option1, values.option2, values.option3, values.option4],
    });

    console.log({
      index: questions.length + 1,
      type: "OPTION",
      text: values.text,
      options: [values.option1, values.option2, values.option3, values.option4],
    });

    objectiveForm.reset();
    successAlert("Added Question");
  };

  // const onSubmitText = async (values: z.infer<typeof textFormSchema>) => {
  //   console.log(values);
  //   textForm.reset();
  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>
            Objective questions will be used to visualize the responses.
          </DialogDescription>
        </DialogHeader>
        {/* <Tabs defaultValue="option">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="option">Objective Question</TabsTrigger>
            <TabsTrigger value="text">Text Question</TabsTrigger>
          </TabsList>
          <TabsContent value="option"> */}
        <Form {...objectiveForm}>
          <form onSubmit={objectiveForm.handleSubmit(onSubmitObjective)}>
            <FormField
              control={objectiveForm.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2 my-2">
                    <FormControl>
                      <Input placeholder="Question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4 my-4">
              <FormField
                control={objectiveForm.control}
                name="option1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Option 1" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={objectiveForm.control}
                name="option2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Option 2" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={objectiveForm.control}
                name="option3"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Option 3" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={objectiveForm.control}
                name="option4"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Option 4" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="secondary"
                type="reset"
                onClick={() => {
                  // textForm.reset();
                  objectiveForm.reset();
                }}
              >
                Reset
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>

        {/* </TabsContent>
          <TabsContent value="text">
            <Form {...textForm}>
              <form onSubmit={textForm.handleSubmit(onSubmitText)}>
                <FormField
                  control={textForm.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2 my-4">
                        <FormControl>
                          <Input placeholder="Question" {...field} />
                        </FormControl>
                        <FormMessage />

                        <FormDescription>
                          Text questions can be used to gather long-form
                          responses from your participants. For the
                          visualization only Objective questions will be used.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center">
                  <Button
                    variant="secondary"
                    type="reset"
                    onClick={() => {
                      objectiveForm.reset();
                      textForm.reset();
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs> */}
      </DialogContent>
    </Dialog>
  );
};
