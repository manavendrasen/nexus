"use client";

import React, { useState } from "react";
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

const SurveyPage = () => {
  const params = useParams();
  const { visualize } = useAppwrite();
  const { getSurvey, survey, questions, loading, userEmail } = useSurvey();
  const { width, height } = useWindowSize();
  const [step, setStep] = useState(0);
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
      <Head>
        <title>Nexus | Survey - {survey?.title}</title>
        <meta
          name="description"
          content="Nexus is a survey platform built on top of Appwrite."
        />
      </Head>

      <div className="min-h-screen flex flex-col gap-3 justify-center items-center overflow-x-hidden py-12 relative bg-gradient-to-t from-muted to-background px-8">
        <Button
          className="absolute top-4 right-4"
          onClick={async () => {
            const res = await visualize(params.surveyId);

            const coordinatesList = [];

            for (let i = 0; i < res.length; i++) {
              const person: any = res[i][Object.keys(res[i])[0]];
              const coordinates = person["coordinates"];
              coordinatesList.push({
                x: coordinates[0],
                y: coordinates[1],
                data: {
                  name: person["textResponses"][0],
                  age: person["textResponses"][1],
                  email: person["textResponses"][2],
                  questionResponses: person["optionResponses"],
                },
              });
            }

            console.log(JSON.stringify(coordinatesList));
          }}
        >
          Visualize
        </Button>
        {loading ? <p>Loading ..</p> : <>{ui}</>}
        {!loading && step > 0 && (
          <>
            {form[step - 1]}
            <div
              className="h-5 bg-accent fixed bottom-0 left-0 w-1 transition-all duration-500 ease-in-out"
              style={{
                width: `calc(${Math.ceil((step / questions.length) * 100)}vw)`,
              }}
            ></div>
          </>
        )}
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
                Once the survey is marked as complete, you will be able to see
                the results.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SurveyPage;
