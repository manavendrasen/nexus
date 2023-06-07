"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSurvey from "@/store/SurveyStore";
import { GetUserEmail } from "@/features/Survey/GetUserEmail";
import { TextResponse } from "@/features/Survey/TextResponse";
import { OptionResponse } from "@/features/Survey/OptionResponse";

const SurveyPage = () => {
  const params = useParams();
  const { getQuestionFromSlug, getSurvey, survey, questions, loading } =
    useSurvey();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [textResponses, setTextResponses] = useState(new Array<string>());
  const [optionResponses, setOptionResponses] = useState(new Array<Number>());

  // if (!params.surveyId) {
  //   return <p>Survey ID not found</p>;
  // }

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
            getQuestionFromSlug(params.surveyId);
          }}
        />
      );
      break;
    // case 1:
    //   ui = (
    //     <>
    //       {/* <div className="fixed top-0 left-1/2 -translate-x-1/2 text-center space-y-4 w-full bg-white z-20 flex items-center flex-col pt-24 pb-12"> */}
    //       <h1 className="text-2xl font-semibold">{survey?.title}</h1>
    //       <p className="text-sm text-muted-foreground w-[500px] text-center">
    //         {survey?.desc}
    //       </p>
    //       {/* </div> */}
    //       <div className="flex flex-col justify-start items-start gap-28 pt-28"></div>
    //     </>
    //   );
    //   break;
    // case 2:
    //   ui = <p>Step 2</p>;
    //   break;
    default:
      break;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col gap-3 justify-center items-center overflow-x-hidden py-12 relative bg-slate-50 px-8">
        {loading ? <p>Loading ..</p> : <>{ui}</>}
        {step > 0 && form[step - 1]}
        {!loading && step > questions.length && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">
              Thanks for participating in the survey!
            </h2>
            <p className="text-muted-foreground">
              Once the survey is marked as complete, you will be able to see the
              results.
            </p>
          </div>
        )}
      </div>
    </>
  );
};



export default SurveyPage;
