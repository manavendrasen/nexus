"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

// features
import { CreateSurvey } from "@/features/Survey/CreateSurvey";

// hooks
import useAppwrite from "@/store/AppwriteStore";
import useSurvey from "@/store/SurveyStore";

// ui
import { Navbar } from "@/components/Navbar/Navbar";
import { Input } from "@/components/Input/Input";
import { Survey } from "@/components/Survey/Survey";
import { Skeleton } from "@/components/Skeleton/Skeleton";

// types
import SurveyType from "@/constants/Survey";
import { useAlert } from "@/components/AlertProvider/AlertProvider";

export default function Dashboard() {
  const { me, getMe, accountService, authLoading } = useAppwrite();
  const { allMySurveys, getSurveys, loading } = useSurvey();
  const [surveyData, setSurveyData] = useState<SurveyType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { errorAlert } = useAlert();

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

  const getMeAndFetchSurveys = async () => {
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
      getSurveys(() => {
        console.log("fetched all services");
        setSurveyData(allMySurveys);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMeAndFetchSurveys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountService]);

  return (
    <>
      <Head>
        <title>Nexus Dashboard</title>
        <meta
          name="description"
          content="Nexus is a survey platform built on top of Appwrite."
        />
      </Head>
      <div className="min-h-screen relative">
        <Navbar />
        {/* <div className="px-12 py-12">
          <h1>Dashboard</h1>
          <pre>{JSON.stringify(me, null, 2)}</pre>
        </div> */}

        {/* Container */}
        <div className="container lg:py-4 lg:px-40 px-8 py-4 mt-4">
          {/* Create Survey */}
          <div className="flex items-center justify-end mb-8 gap-4">
            <Input
              disabled={loading}
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <CreateSurvey />
          </div>

          {/* Surveys */}
          {loading || authLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
          ) : (
            <>
              {surveyData.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-xl font-bold mb-4">No surveys found</p>
                  <p className="text-gray-500 text-sm">
                    Create a new survey to get started.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
