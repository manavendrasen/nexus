"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar/Navbar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, Plus, Save } from "lucide-react";
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
import useSurvey from "@/store/SurveyStore";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import Question from "@/constants/Question";
import { PersonalQuestions } from "@/constants/PersonalQuestions";
import { get } from "http";

interface SurveyPageProps {}

const SurveyPage: React.FC<SurveyPageProps> = () => {
  const { surveyId } = useParams();
  const {
    survey,
    getSurvey,
    questions,
    loading,
    updateSurveyStatus,
    getQuestionFromSlug,
  } = useSurvey();
  const { successAlert } = useAlert();
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = `${process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL}/${surveyId}`;

  // TODO: Fetch survey data from server
  useEffect(() => {
    if (!survey?.title) {
      router.back();
    }
    if (searchParams.has("new")) {
      successAlert("Draft survey created! You can now add questions to it");
    } else {
      console.log("surveyId", surveyId);
      try {
        getSurvey(surveyId);
        getQuestionFromSlug(surveyId);
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    getQuestionFromSlug,
    getSurvey,
    router,
    searchParams,
    successAlert,
    survey?.title,
    surveyId,
  ]);

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

  // const ObjectiveQuestions = [
  //   {
  //     index: 1,
  //     type: "OPTION",
  //     text: "What is your name?",
  //     options: ["John", "Jane", "Jack", "Jill"],
  //   },
  //   {
  //     index: 2,
  //     type: "OPTION",
  //     text: "What is your age?",
  //     options: ["18-25", "26-35", "36-45", "46-55"],
  //   },
  // ];

  let action;

  switch (survey?.status) {
    case "ACTIVE":
      action = (
        <Button
          onClick={() => {
            updateSurveyStatus("COMPLETE");
            getSurvey(surveyId);
          }}
        >
          <Check size={16} className="mr-2" /> Complete
        </Button>
      );
      break;
    case "DRAFT":
      action = (
        <Button
          onClick={() => {
            updateSurveyStatus("ACTIVE");
            getSurvey(surveyId);
          }}
        >
          <Save size={16} className="mr-2" /> Publish
        </Button>
      );
      break;
    case "COMPLETE":
      action = (
        <p className="text-sm font-semibold mt-1 text-slate-500">COMPLETED</p>
      );
      break;
  }

  return (
    <div className="bg-slate-50 min-h-screen relative">
      <Navbar />

      <div className="container lg:py-4 lg:px-40 px-8 py-4 mt-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-6 w-[200px]" />
          </div>
        ) : (
          <section className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold mb-2">{survey?.title}</h1>
              <p className="text-sm text-gray-700">{survey?.desc}</p>
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
            <div>{action}</div>
          </section>
        )}

        <section className="my-8">
          <Tabs
            defaultValue={
              survey?.status === "COMPLETE" ? "responses" : "questions"
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger disabled={loading} value="questions">
                Questions
              </TabsTrigger>
              <TabsTrigger disabled={loading} value="responses">
                Responses
              </TabsTrigger>
            </TabsList>
            {loading ? (
              <>
                <div className="space-y-4 my-8">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
                <div className="space-y-4 my-8">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
                <div className="space-y-4 my-8">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
              </>
            ) : (
              <TabsContent value="questions">
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {questions.map((question, index) => {
                    if (question.type === "TEXT") {
                      return (
                        <TextQuestion
                          key={question.text}
                          index={index}
                          question={question}
                          allowEdit={survey?.status === "DRAFT"}
                        />
                      );
                    } else if (question.type === "OPTION") {
                      return (
                        <ObjectiveQuestion
                          key={question.text}
                          question={question}
                          index={index}
                          allowEdit={survey?.status === "DRAFT"}
                        />
                      );
                    }
                  })}
                </div>
                {survey?.status === "DRAFT" && (
                  <div className="flex justify-end mt-6">
                    <AddQuestion />
                  </div>
                )}
              </TabsContent>
            )}
            <TabsContent value="responses"></TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
};

export default SurveyPage;
