"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSurvey from "@/store/SurveyStore";
import { GetUserEmail } from "@/features/Survey/GetUserEmail";
import { TextResponse } from "@/features/Survey/TextResponse";
import { OptionResponse } from "@/features/Survey/OptionResponse";
import { Button } from "@/components/Button/Button";
import axios from "axios";

export const metadata = {
  title: "Nexux Survey",
  description: "Nexux is a survey platform built on top of Appwrite.",
};

const SurveyPage = () => {
  const params = useParams();

  const { getSurvey, survey, questions, loading, userEmail } = useSurvey();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [textResponses, setTextResponses] = useState(new Array<string>());
  const [optionResponses, setOptionResponses] = useState(new Array<Number>());

  const form = questions?.map((question, index) => {
    if (question.type === "TEXT") {
      return (
        <TextResponse
          key={`${question.surveySlug}-${question.index}`}
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
      );
    } else if (question.type === "OPTION") {
      return (
        <OptionResponse
          key={`${question.surveySlug}-${question.index}`}
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
      );
    }
  });

  let ui;
  switch (step) {
    case 0:
      ui = (
        <GetUserEmail
          next={() => {
            setStep(1);
            getSurvey(params.surveyId);
          }}
        />
      );
      break;
    default:
      break;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col gap-3 justify-center items-center overflow-x-hidden py-12 relative bg-gradient-to-t from-muted to-background px-8">
        {loading ? <p>Loading ..</p> : <>{ui}</>}
        {!loading && step > 0 && form[step - 1]}
        {!loading && step > questions.length && (
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
                setSubmitLoading(false);
                setStep(-1);
              }}
            >
              {submitLoading ? "Submitting.." : "Submit"}
            </Button>
          </div>
        )}
        {!loading && step === -1 && (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">
              Thanks for participating in the survey!
            </h2>
            <p className="text-muted-foreground">
              Once the survey is marked as complete, you will be able to see the
              results.
            </p>
          </div>
        )}
      </div>

      <Button
        onClick={async () => {
          const response = await axios.get(
            `/api/survey?surveySlug=${params.surveyId}`
          );
          console.log(JSON.stringify(response.data.response, null, 2));
        }}
      >
        Result
      </Button>
    </>
  );
};



export default SurveyPage;
