"use client";

import React from "react";
import { Navbar } from "@/components/Navbar/Navbar";
import { useParams } from "next/navigation";
import { Copy } from "lucide-react";
import { useAlert } from "@/components/AlertProvider/AlertProvider";
import { ObjectiveQuestion } from "@/components/Question/ObjectiveQuestion";
import { TextQuestion } from "@/components/Question/TextQuestion";

interface SurveyPageProps {}

const SurveyPage: React.FC<SurveyPageProps> = () => {
  const { surveyId } = useParams();
  const { successAlert } = useAlert();
  const url = `${process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL}/${surveyId}`;

  // TODO: Fetch survey data from server

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

  return (
    <div className="bg-slate-50 min-h-screen relative">
      <Navbar />

      <div className="container lg:py-4 lg:px-40 px-8 py-4 mt-4">
        <h1 className="text-3xl font-semibold">{surveyId}</h1>
        <div
          className="my-4 px-6 py-4 font-medium text-slate-600 text-sm bg-white rounded-md border-2 border-slate-200 w-min whitespace-nowrap flex items-center gap-2"
          onClick={() => {
            navigator.clipboard.writeText(url);
            successAlert("Copied to clipboard");
          }}
        >
          <Copy size={16} /> {url}
        </div>
        <section className="my-8">
          <h2>Questions</h2>
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
        </section>
      </div>
    </div>
  );
};

export default SurveyPage;
