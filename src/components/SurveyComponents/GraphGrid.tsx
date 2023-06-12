"use client";

import Question from "@/constants/Question";
import Response from "@/constants/Response";
import Survey from "@/constants/Survey";
import React, { useState } from "react";
import { ScatterPlot } from "../ScatterPlot/ScatterPlot";

interface GraphGridProps {
  survey: Survey;
  questions: Question[];
  responses: Response[];
  userEmail?: string;
  showHeader?: boolean;
}

export const GraphGrid: React.FC<GraphGridProps> = ({
  survey,
  questions,
  responses,
  userEmail,
  showHeader = false,
}) => {
  const [selectedResponse, setSelectedResponse] = useState<Response>();
  const onPointClick = (data: Response) => {
    setSelectedResponse(data);
  };

  return (
    <div className="w-full lg:container h-full flex-1 flex flex-col">
      {showHeader && (
        <header className="flex justify-start md:justify-between gap-4 flex-wrap items-center mb-12">
          <h1 className="font-semibold cursor-pointer text-foreground">
            Nexus
          </h1>
          {survey && (
            <p>
              {survey.title} (#{survey.slug})
            </p>
          )}
        </header>
      )}
      <main
        className="flex-1 h-full md:grid md:grid-cols-3 flex flex-col gap-6"
        // style={{
        //   display: "grid",
        //   gridTemplateColumns: "2fr 1fr",
        //   gap: "1rem",
        // }}
      >
        <div
          className={`${
            selectedResponse ? "col-span-2" : "col-span-3"
          } transition-all ease-in`}
        >
          <ScatterPlot
            data={responses}
            userEmail={userEmail}
            onPointClick={onPointClick}
          />
        </div>

        {/* TODO when clicked on the scatter plot, show the question and the response */}
        {selectedResponse && (
          <div
            className="overflow-y-scroll break-words p-4 col-span-1 transition-all ease-in"
            style={{
              height: "calc(100vh - 180px)",
            }}
          >
            <h2 className="font-bold text-lg">{selectedResponse?.name}</h2>
            <p className="text-secondary underline cursor-pointer">
              {selectedResponse?.textResponses[2]}
            </p>
            <p className="mt-2">{selectedResponse?.textResponses[1]}</p>
            <div className="grid grid-cols-1 gap-4">
              {questions.slice(3).map((question, index) => (
                <div
                  key={`${question.surveySlug}-${question.index}`}
                  className="mt-4 grid grid-cols-1 gap-1"
                >
                  <p>
                    {index + 1}. {question.text}
                  </p>
                  {/* selectedResponse.optionResponses[index] */}
                  <Pill
                    content={question.options!.at(
                      selectedResponse!.optionResponses[index]
                    )}
                    option={selectedResponse!.optionResponses[index]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

interface PillProps {
  content?: string;
  option?: number;
}

export const Pill: React.FC<PillProps> = ({ content, option }) => {
  let styles = "";
  switch (option) {
    case 0:
      styles = "bg-primary";
      break;
    case 1:
      styles = "bg-destructive";
      break;
    case 2:
      styles = "bg-accent";
      break;
    case 3:
      styles = "bg-ring";
      break;

    default:
      break;
  }
  return (
    <div
      className={`mt-2 flex items-center gap-2 text-sm text-primary-foreground ${styles} w-max p-1 rounded pr-4 pl-3`}
    >
      <div className="h-1 w-1 rounded-full bg-primary-foreground" />
      {content}
    </div>
  );
};
