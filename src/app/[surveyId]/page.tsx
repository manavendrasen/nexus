"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Confetti from "react-confetti";
import axios from "axios";
import { useParams } from "next/navigation";

// hooks
import useWindowSize from "react-use/lib/useWindowSize";
import useSurvey from "@/store/SurveyStore";

// features
import { GetUserEmail } from "@/features/Survey/GetUserEmail";

// ui
import { TextResponse } from "@/features/Survey/TextResponse";
import { OptionResponse } from "@/features/Survey/OptionResponse";
import { Button } from "@/components/Button/Button";
import useAppwrite from "@/store/AppwriteStore";
import { ScatterPlot } from "@/components/ScatterPlot/ScatterPlot";

const SurveyPage = () => {
  const params = useParams();
  const {
    getSurvey,
    survey,
    questions,
    loading,
    userEmail,
    updateSurveyResponseCount,
    responses,
    getResponses,
  } = useSurvey();
  const { width, height } = useWindowSize();
  const [step, setStep] = useState(0);
  const [ui, setUi] = useState<React.ReactNode>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [textResponses, setTextResponses] = useState(new Array<string>());
  const [optionResponses, setOptionResponses] = useState(new Array<Number>());

  const form = questions?.map((question, index) => {
    if (question.type === "TEXT") {
      return (
        <div
          className="transition-all duration-500 ease-in-out animate-in animate-out"
          key={`${question.surveySlug}-${question.index}`}
        >
          <TextResponse
            question={question.text}
            index={question.index!}
            next={() => {
              setStep(prev => prev + 1);
            }}
            handleResponse={text => {
              setTextResponses(prev => {
                prev.push(text);
                return prev;
              });
            }}
          />
        </div>
      );
    } else if (question.type === "OPTION") {
      return (
        <div
          className="transition-all duration-500 ease-in-out animate-in animate-out"
          key={`${question.surveySlug}-${question.index}`}
        >
          <OptionResponse
            question={question.text}
            index={question.index!}
            option={question.options!}
            next={() => {
              setStep(prev => prev + 1);
            }}
            handleResponse={(option: number) => {
              setOptionResponses(prev => {
                prev.push(option);
                return prev;
              });
            }}
          />
        </div>
      );
    }
  });

  useEffect(() => {
    if (loading) {
      setUi(<p>Loading ..</p>);
    } else if (survey?.status === "COMPLETE") {
      if (responses && responses.length === 0) {
        getResponses(params.surveyId, () => {
          setUi(
            <div className="container h-full flex-1 flex flex-col">
              <header className="flex justify-between items-center mb-12">
                <h1 className="font-semibold cursor-pointer text-foreground">
                  Nexus
                </h1>
                <p>
                  {survey.title} (#{survey.slug})
                </p>
              </header>
              <main
                className="flex-1 h-full"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <ScatterPlot data={responses} userEmail={userEmail} />
                </div>
                <div className="overflow-y-scroll break-words">
                  <pre>
                    {JSON.stringify(questions, null, 2)}
                    {JSON.stringify(responses, null, 2)}
                  </pre>
                </div>
              </main>
            </div>
          );
        });
      } else {
        setUi(
          <div className="container h-full pb-12 flex-1 flex flex-col">
            <header className="flex justify-between items-center mb-12">
              <h1 className="font-semibold cursor-pointer text-foreground">
                Nexus
              </h1>
              <p>
                {survey.title} (#{survey.slug})
              </p>
            </header>
            <main
              className="flex-1 h-full"
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "2rem",
                wordWrap: "break-word",
              }}
            >
              <div className="bg-background p-4 rounded shadow-lg">
                <ScatterPlot data={responses} userEmail={userEmail} />
              </div>
              <div className="overflow-y-scroll overflow-x-clip  break-words">
                <pre>
                  {JSON.stringify(questions, null, 2)}
                  {JSON.stringify(responses, null, 2)}
                </pre>
              </div>
            </main>
          </div>
        );
      }
    } else if (step === -1) {
      setUi(
        <>
          <Confetti
            width={width}
            height={height}
            colors={[
              "#f38ba8",
              "#fab387",
              "#a6e3a1",
              "#89b4fa",
              "#cba6f7",
              "#f5c2e7",
            ]}
            numberOfPieces={100}
          />
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">
              Thanks for participating in the survey!
            </h2>
            <p className="text-muted-foreground">
              Once the survey is marked as complete, you will be able to see the
              results.
            </p>
          </div>
        </>
      );
    } else if (step === 0) {
      setUi(
        <GetUserEmail
          next={() => {
            setStep(1);
            getSurvey(params.surveyId);
          }}
        />
      );
    } else if (step > 0) {
      setUi(
        <>
          {form[step - 1]}
          <div
            className="h-5 bg-accent fixed top-0 left-0 w-1 transition-all duration-500 ease-in-out"
            style={{
              width: `calc(${Math.ceil((step / questions.length) * 100)}vw)`,
            }}
          />
        </>
      );
    } else if (step > questions.length) {
      setUi(
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">Submit the survey!</h2>
          <Button
            disabled={submitLoading}
            onClick={async () => {
              setSubmitLoading(true);
              await axios.post("/api/survey", {
                response: {
                  surveySlug: params.surveyId,
                  userEmail,
                  textResponses,
                  optionResponses,
                },
              });
              updateSurveyResponseCount();
              setSubmitLoading(false);
              setStep(-1);
            }}
          >
            {submitLoading ? "Submitting.." : "Submit"}
          </Button>
        </div>
      );
    }
    console.log(step, loading, survey, questions.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, loading, survey, questions.length, responses.length]);

  return (
    <>
      <Head>
        <title>Nexus | Survey - {survey?.title}</title>
        <meta
          name="description"
          content="Nexus is a survey platform built on top of Appwrite."
        />
      </Head>

      <div className="h-screen flex flex-col gap-3 justify-center items-center overflow-x-hidden py-12 relative bg-gradient-to-t from-muted to-background px-8">
        {ui}
      </div>
    </>
  );
};

export default SurveyPage;
