"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAppwrite from "@/store/AppwriteStore";
import { Navbar } from "@/components/Navbar/Navbar";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Plus } from "lucide-react";
import { CreateSurvey } from "@/features/Survey/CreateSurvey";
import useSurvey from "@/store/SurveyStore";
import SurveyType from "@/constants/Survey";
import { Survey } from "@/components/Survey/Survey";
import { Skeleton } from "@/components/Skeleton/Skeleton";

export default function Dashboard() {
  const { me } = useAppwrite();
  const { allMySurveys, getSurveys, loading } = useSurvey();
  const [surveyData, setSurveyData] = useState<SurveyType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  useEffect(() => {
    const filtered = allMySurveys.filter(survey => {
      return (
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setSurveyData(filtered);

    if (searchTerm === "") {
      setSurveyData(allMySurveys);
    }
  }, [searchTerm, surveyData, allMySurveys]);

  useEffect(() => {
    if (!me) {
      alert("You are not logged in");

      // router.push("/");
    } else {
      try {
        getSurveys();
        setSurveyData(allMySurveys);
      } catch (error) {
        console.log(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (!me?.emailVerification) {
  //   return (
  //     <div>
  //       <h1>Dashboard</h1>
  //       <p>Check your email to verify your account.</p>
  //     </div>
  //   );
  // } else {
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
            disabled={loading}
            placeholder="Search"
            className="bg-white"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <CreateSurvey />
        </div>

        {/* Surveys */}
        {loading ? (
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {surveyData.length === 0 && (
              <div className="col-span-3 flex flex-col items-center justify-center">
                <p className="text-xl font-bold mb-4">No surveys found</p>
                <p className="text-gray-500 text-sm">
                  Create a new survey to get started.
                </p>
              </div>
            )}
            {surveyData.map(survey => (
              <Survey
                key={survey.slug}
                title={survey.title}
                responseCount={survey.responseCount || 0}
                slug={survey.slug}
                status={survey.status || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
