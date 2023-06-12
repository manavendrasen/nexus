"use client";

import axios from "axios";
import Head from "next/head";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// hooks
import useSurvey from "@/store/SurveyStore";

// features
import { GetUserEmail } from "@/features/Survey/GetUserEmail";

// ui
import { Button } from "@/components/Button/Button";
import { ScatterPlot } from "@/components/ScatterPlot/ScatterPlot";
import { OptionResponse } from "@/features/Survey/OptionResponse";
import { TextResponse } from "@/features/Survey/TextResponse";
import { GraphGrid } from "@/components/SurveyComponents/GraphGrid";
import { Thankyou } from "@/components/SurveyComponents/Thankyou";

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
  const [step, setStep] = useState(0);
  const [ui, setUi] = useState<React.ReactNode>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [textResponses, setTextResponses] = useState(new Array<string>());
  const [optionResponses, setOptionResponses] = useState(new Array<Number>());

  useEffect(() => {
    console.log(step, questions.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

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
            <GraphGrid
              questions={questions}
              responses={responses}
              survey={survey}
              userEmail={userEmail}
              showHeader
            />
          );
        });
      } else {
        setUi(
          <GraphGrid
            questions={questions}
            responses={responses}
            survey={survey}
            userEmail={userEmail}
            showHeader
          />
        );
      }
    } else if (step === -1) {
      setUi(<Thankyou />);
    } else if (step === 0) {
      setUi(
        <GetUserEmail
          next={() => {
            setStep(1);
            getSurvey(params.surveyId);
          }}
        />
      );
    } else if (step > 0 && step < questions.length) {
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
    } else if (step >= questions.length) {
      console.log("here");

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

      <div className="min-h-screen flex flex-col gap-3 justify-center items-center overflow-x-hidden py-12 relative bg-gradient-to-t from-muted to-background px-8">
        {/* <header className="flex justify-start md:justify-between gap-4 flex-wrap items-center mb-12">
          <h1 className="font-semibold cursor-pointer text-foreground">
            Nexus
          </h1>
          {survey && (
            <p>
              {survey.title} (#{survey.slug})
            </p>
          )}
        </header> */}
        {ui}
      </div>
    </>
  );
};

export default SurveyPage;
