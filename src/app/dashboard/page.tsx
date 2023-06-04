"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAppwrite from "@/store/AppwriteStore";
import { Navbar } from "@/components/Navbar/Navbar";
import { Survey } from "@/components/Survey/Survey";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Plus } from "lucide-react";

const SurveyData = [
  {
    title: "Survey 1",
    responseCount: 10,
    slug: "survey-1",
    status: "ACTIVE",
  },
  {
    title: "Survey 2",
    responseCount: 20,
    slug: "survey-2",
    status: "INACTIVE",
  },
  {
    title: "Survey 3",
    responseCount: 30,
    slug: "survey-3",
    status: "ACTIVE",
  },
  {
    title: "Survey 4",
    responseCount: 40,
    slug: "survey-4",
    status: "INACTIVE",
  },
];

export default function Dashboard() {
  const { me, fetchMe } = useAppwrite();
  const [surveyData, setSurveyData] = useState(SurveyData);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  useEffect(() => {
    const filtered = SurveyData.filter(survey => {
      return (
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setSurveyData(filtered);

    if (searchTerm === "") {
      setSurveyData(SurveyData);
    }
  }, [searchTerm, surveyData]);

  if (!me) {
    router.back();
  } else if (!me.emailVerification) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Check your email to verify your account.</p>
      </div>
    );
  } else {
    return (
      <div className="bg-slate-50 min-h-screen relative">
        <Navbar title="Nexux Surveys" />
        {/* <div className="px-12 py-12">
          <h1>Dashboard</h1>
          <pre>{JSON.stringify(me, null, 2)}</pre>
        </div> */}

        {/* Container */}
        <div className="container lg:py-4 lg:px-40 px-8 py-4 mt-4 bg-slate-50">
          {/* Create Survey */}
          <div className="flex items-center justify-end mb-8 gap-4">
            <Input
              placeholder="Search"
              className="bg-white"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button>
              <Plus size={16} /> <p className="w-max ml-2">Add New</p>
            </Button>
          </div>

          {/* Surveys */}
          <div className="grid grid-cols-3 gap-6">
            {surveyData.map(survey => (
              <Survey
                key={survey.slug}
                title={survey.title}
                responseCount={survey.responseCount}
                slug={survey.slug}
                status={survey.status}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
