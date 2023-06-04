"use client";

import React from "react";
import { useParams } from "next/navigation";

interface SurveyPageProps {}

const SurveyPage: React.FC<SurveyPageProps> = () => {
  const params = useParams();

  if (!params.surveyId) {
    return <p>Survey ID not found</p>;
  }

  return <p>{params.surveyId}</p>;
};

export default SurveyPage;
