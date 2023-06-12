"use client";

import Head from "next/head";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// features
import { AddQuestion } from "@/features/Question/AddQuestion";

// hooks
import { useAlert } from "@/components/AlertProvider/AlertProvider";
import useAppwrite from "@/store/AppwriteStore";
import useSurvey from "@/store/SurveyStore";

// icons
import { Check, Copy, Save } from "lucide-react";

// ui
import { Button } from "@/components/Button/Button";
import { Navbar } from "@/components/Navbar/Navbar";
import { ObjectiveQuestion } from "@/components/Question/ObjectiveQuestion";
import { TextQuestion } from "@/components/Question/TextQuestion";
import { ScatterPlot } from "@/components/ScatterPlot/ScatterPlot";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/Tabs/Tabs";

interface SurveyPageProps {}

const SurveyPage: React.FC<SurveyPageProps> = () => {
  const { surveyId } = useParams();
  const { databaseService, me, getMe } = useAppwrite();
  const {
    survey,
    getSurvey,
    questions,
    responses,
    loading,
    updateSurveyStatus,
    visualize,
    getResponses,
  } = useSurvey();
  const { successAlert, errorAlert } = useAlert();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("questions");
  const url = `${process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL}/${surveyId}`;

  const getMeAndFetchSurvey = async () => {
    // me is undefined = maybe logged in but not in state
    try {
      if (!me) {
        // is isAuth is true, then user is logged in
        const isAuth = await getMe();
        console.log("isAuth", isAuth);

        if (!isAuth) {
          errorAlert("You must be logged in to view this page.");
          router.push("/");
        }
      }
    } catch (error) {
      // If it fails, accountService will be undefined
      console.log(error);
      // errorAlert("Something went wrong. Please try again later.");
    }

    try {
      getSurvey(surveyId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      getMeAndFetchSurvey();
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseService]);

  let action;

  switch (survey?.status) {
    case "ACTIVE":
      action = (
        <Button
          onClick={async () => {
            successAlert("Working our magic ✨...");
            await visualize(surveyId);
            updateSurveyStatus("COMPLETE", async () => {
              getSurvey(surveyId);
              setActiveTab("responses");
            });
            successAlert("Survey successfully completed!");
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
        <p className="text-sm font-semibold mt-1 text-muted-foreground">
          COMPLETED
        </p>
      );
      break;
  }

  return (
    <>
      <Head>
        <title>Nexus | Dashboard - {survey?.title}</title>
        <meta
          name="description"
          content="Nexus is a survey platform built on top of Appwrite."
        />
      </Head>
      <div className="min-h-screen relative">
        <Navbar href="/dashboard" />

        <div className="container lg:py-4 lg:px-40 px-8 py-4 mt-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-6 w-[200px]" />
            </div>
          ) : (
            <section className="flex sm:justify-between items-start justify-start flex-wrap gap-6">
              <div>
                <h1 className="text-3xl font-semibold mb-2">{survey?.title}</h1>
                <p className="text-sm text-muted-foreground">{survey?.desc}</p>
                {survey?.status === "ACTIVE" && (
                  <div
                    className="cursor-pointer hover:border-accent hover:text-accent max-w-full my-4 px-6 py-4 font-medium text-muted-foreground text-sm bg-background rounded-md border-2 border-border w-min whitespace-nowrap flex items-center gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      successAlert("Code copied to clipboard");
                    }}
                  >
                    <Copy size={16} /> {surveyId}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                {action}
                {survey?.responseCount} responses
              </div>
            </section>
          )}

          <section className="my-8">
            <Tabs
              // defaultValue={
              //   survey?.status === "COMPLETE" ? "responses" : "questions"
              // }
              value={activeTab}
            >
              {survey?.status === "COMPLETE" && (
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    disabled={loading}
                    value="questions"
                    onClick={() => {
                      setActiveTab("questions");
                    }}
                  >
                    Questions
                  </TabsTrigger>
                  <TabsTrigger
                    disabled={loading}
                    value="responses"
                    onClick={() => {
                      if (
                        responses.length === 0 ||
                        responses[0].surveySlug !== surveyId
                      ) {
                        getResponses(surveyId);
                      }
                      setActiveTab("responses");
                    }}
                  >
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
                              key={`${question.text}-${index}`}
                              index={index}
                              question={question}
                              allowEdit={survey?.status === "DRAFT"}
                            />
                          );
                        } else if (question.type === "OPTION") {
                          return (
                            <ObjectiveQuestion
                              key={`${question.text}-${index}`}
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
              <TabsContent value="responses">
                <div className="h-96 mt-8">
                  {!loading && responses && <ScatterPlot data={responses} />}
                </div>

                {/* <pre>{JSON.stringify(responses, null, 2)}</pre> */}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </>
  );
};

export default SurveyPage;
