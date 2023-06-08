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
import axios from "axios";
import Link from "next/link";

interface SurveyPageProps {}

const SurveyPage: React.FC<SurveyPageProps> = () => {
  const { surveyId } = useParams();
  const { survey, getSurvey, questions, loading, updateSurveyStatus } =
    useSurvey();
  const { successAlert } = useAlert();
  const url = `${process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL}/${surveyId}`;

  useEffect(() => {
    try {
      getSurvey(surveyId);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let action;

  switch (survey?.status) {
    case "ACTIVE":
      action = (
        <Button
          onClick={async () => {
            updateSurveyStatus("COMPLETE", async () => {
              getSurvey(surveyId);
              const response = await axios.get(
                `/api/survey?surveySlug=${surveyId}`
              );
              alert(JSON.stringify(response.data));
            });
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
            updateSurveyStatus("ACTIVE", () => {
              getSurvey(surveyId);
            });
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
    <div className="min-h-screen relative">
      <Navbar href="/dashboard" />

      <div className="container lg:py-4 lg:px-40 px-8 py-4 mt-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-6 w-[200px]" />
          </div>
        ) : (
          <section className="flex md:justify-between items-start justify-start flex-wrap gap-6">
            <div>
              <h1 className="text-3xl font-semibold mb-2">{survey?.title}</h1>
              <p className="text-sm text-gray-700">{survey?.desc}</p>
              {survey?.status === "ACTIVE" && (
                <div
                  className="cursor-pointer hover:border-accent hover:font-semibold my-4 px-6 py-4 font-medium text-muted-foreground text-sm bg-background rounded-md border-2 border-border w-min whitespace-nowrap flex items-center gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    successAlert("Copied to clipboard");
                  }}
                >
                  <Copy size={16} /> {url}
                </div>
              )}
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
            {survey?.status === "COMPLETE" && (
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger disabled={loading} value="questions">
                  Questions
                </TabsTrigger>
                <TabsTrigger disabled={loading} value="responses">
                  Responses
                </TabsTrigger>
              </TabsList>
            )}
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
                {questions && (
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
                )}
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
