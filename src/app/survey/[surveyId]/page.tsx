"use client";

import React from "react";
import { Navbar } from "@/components/Navbar/Navbar";
import { useParams } from "next/navigation";
import { Check, Copy, Plus } from "lucide-react";
import { useAlert } from "@/components/AlertProvider/AlertProvider";
import { ObjectiveQuestion } from "@/components/Question/ObjectiveQuestion";
import { TextQuestion } from "@/components/Question/TextQuestion";
import { Button } from "@/components/Button/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Tabs/Tabs";
import { AddQuestion } from "@/features/Question/AddQuestion";

interface SurveyPageProps {}

const SurveyPage: React.FC<SurveyPageProps> = () => {
  const { surveyId } = useParams();
  const { successAlert } = useAlert();
  const url = `${process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL}/${surveyId}`;

  // TODO: Fetch survey data from server

  /**
   * Survey data structure:
   * slug - string (unique)
   * title - string
   * description - string
   * status - string
   * createdAt
   * updatedAt
   * createdBy
   * questions -
   * [
   *   id - string (unique)
   *   type - string (objective/text)
   *   text - string
   *   options - array of strings
   * ]
   * responses -
   * [
   *   questionId - string
   *   user
   *   response - string
   * ]
   */

  const ObjectiveQuestions = [
    {
      id: 1,
      text: "What is your name?",
      options: ["John", "Jane", "Jack", "Jill"],
    },
    {
      id: 2,
      text: "What is your age?",
      options: ["18-25", "26-35", "36-45", "46-55"],
    },
  ];

  const TextQuestions = [
    {
      id: 1,
      text: "What is your name?",
    },
    {
      id: 2,
      text: "What is your age?",
    },
  ];

  const status: string = "ACTIVE";

  return (
    <div className="bg-slate-50 min-h-screen relative">
      <Navbar />

      <div className="container lg:py-4 lg:px-40 px-8 py-4 mt-4">
        <section className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold">{surveyId}</h1>
            <div
              className="cursor-pointer hover:border-slate-500 hover:font-semibold my-4 px-6 py-4 font-medium text-slate-600 text-sm bg-white rounded-md border-2 border-slate-200 w-min whitespace-nowrap flex items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(url);
                successAlert("Copied to clipboard");
              }}
            >
              <Copy size={16} /> {url}
            </div>
          </div>
          <div
            className={`text-sm font-semibold mt-4 ${
              status === "ACTIVE" ? "text-green-500" : "text-slate-500"
            }`}
          >
            {status === "ACTIVE" ? (
              <Button>
                <Check size={16} className="mr-2" /> Complete
              </Button>
            ) : (
              <p>{status}</p>
            )}
          </div>
        </section>

        <section className="my-8">
          <Tabs defaultValue={status === "ACTIVE" ? "questions" : "responses"}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
            </TabsList>
            <TabsContent value="questions">
              <div className="grid grid-cols-1 gap-4 mt-4">
                {TextQuestions.map((question, index) => (
                  <TextQuestion
                    key={question.id}
                    index={index}
                    question={question}
                  />
                ))}
                {ObjectiveQuestions.map((question, index) => (
                  <ObjectiveQuestion
                    key={question.id}
                    question={question}
                    index={index}
                  />
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <AddQuestion />
              </div>
            </TabsContent>
            <TabsContent value="responses"></TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
};

export default SurveyPage;
