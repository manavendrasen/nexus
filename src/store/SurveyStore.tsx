import { create } from "zustand";
import { Client, Account, ID, Databases, Models, Query } from "appwrite";
import Survey from "@/constants/Survey";
import useAppwrite from "./AppwriteStore";
import {
  COLLECTION_ID_QUESTION,
  COLLECTION_ID_RESPONSE,
  COLLECTION_ID_SURVEY,
  DATABASE_ID,
} from "@/constants/DatabaseIds";
import Question from "@/constants/Question";
import { PersonalQuestions } from "@/constants/PersonalQuestions";
import Response from "@/constants/Response";

/**
 * When the user visits the survey link, they will be presented with a form.
 * 1. The user will be asked to enter their email.
 * 2. Create Anonymous User
 * 3. Create Survey Response
 * 4. Save Survey Response
 *
 * Create Survey
 *
 */

interface SurveyStore {
  loading: boolean;
  userEmail: string;
  questions: Question[];
  setUserEmail: (email: string) => void;
  survey?: Survey;
  setSurvey: (survey: Survey) => void;
  getSurvey: (slug: string) => void;
  getQuestionFromSlug: (slug: string) => void;
  submitSurvey: (response: Response) => void;

  // dashboard
  getSurveys: () => void;
  allMySurveys: Survey[];
  createSurvey: (survey: Survey) => void;
  addQuestion: (question: Question) => void;
  createQuestion: (question: Question) => void;
  updateSurveyStatus: (status: string) => void;
}

const useSurvey = create<SurveyStore>()((set, get) => ({
  loading: false,
  userEmail: "",
  survey: undefined,
  questions: [],
  allMySurveys: [],
  addQuestion: (question: Question) => {
    set({
      questions: [
        ...get().questions,
        {
          index: get().questions.length,
          type: "OPTION",
          text: question.text,
          options: question.options,
          surveySlug: get().survey?.slug,
        },
      ],
    });
  },
  setUserEmail: (email: string) => set({ userEmail: email }),
  setSurvey: (survey: Survey) => set({ survey: survey }),
  getSurveys: async () => {
    set({ loading: true });
    try {
      const response = await useAppwrite
        .getState()
        .databaseService?.listDocuments(DATABASE_ID, COLLECTION_ID_SURVEY, [
          Query.equal("createdBy", useAppwrite.getState().me!.$id),
        ]);
      console.log("response", response);

      if (!response) throw new Error("Survey not found");

      const fetchedSurveys = response.documents;

      set({
        allMySurveys: fetchedSurveys.map(survey => ({
          slug: survey.slug,
          title: survey.title,
          desc: survey.desc,
          questions: survey.questions,
          createdBy: survey.createdBy,
          status: survey.status,
          responseCount: survey.responseCount,
        })),
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  getSurvey: async (slug: string) => {
    set({ loading: true });
    try {
      const response = await useAppwrite
        .getState()
        .databaseService?.listDocuments(DATABASE_ID, COLLECTION_ID_SURVEY, [
          Query.equal("slug", slug),
        ]);

      console.log("response", response);

      if (!response) throw new Error("Survey not found");

      if (response.documents.length === 0) {
        throw new Error("Survey not found");
      }

      const fetchedSurvey = response.documents[0];

      set({
        survey: {
          slug: fetchedSurvey.slug,
          title: fetchedSurvey.title,
          desc: fetchedSurvey.desc,
          questions: fetchedSurvey.questions,
          createdBy: fetchedSurvey.createdBy,
          status: fetchedSurvey.status,
          responseCount: fetchedSurvey.responseCount,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  createQuestion: async (question: Question) => {
    set({ loading: true });
    try {
      const response = await useAppwrite
        .getState()
        .databaseService?.createDocument(
          DATABASE_ID,
          COLLECTION_ID_QUESTION,
          ID.unique(),
          {
            index: Number(question.index),
            type: question.type,
            text: question.text,
            options: question.options,
            surveySlug: get().survey?.slug,
          }
        );
      console.log("response", response);
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  createSurvey: async (survey: Survey) => {
    set({ loading: true });
    try {
      const response = await useAppwrite
        .getState()
        .databaseService?.createDocument(
          DATABASE_ID,
          COLLECTION_ID_SURVEY,
          survey.slug,
          {
            slug: survey.slug,
            title: survey.title,
            desc: survey.desc,
            responseCount: 0,
            status: "ACTIVE",
            createdBy: useAppwrite.getState().me?.$id,
          }
        );

      const personalQuestionPromises = PersonalQuestions.map(question => {
        return useAppwrite
          .getState()
          .databaseService?.createDocument(
            DATABASE_ID,
            COLLECTION_ID_QUESTION,
            ID.unique(),
            {
              index: Number(question.index),
              type: question.type,
              text: question.text,
              surveySlug: get().survey?.slug,
            }
          );
      });

      const personalQuestionResponse = await Promise.all(
        personalQuestionPromises
      );

      console.log("response", response);
      console.log("personalQuestionResponse", personalQuestionResponse);
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  updateSurveyStatus: async (status: string) => {
    set({ loading: true });
    try {
      const response = await useAppwrite
        .getState()
        .databaseService?.updateDocument(
          DATABASE_ID,
          COLLECTION_ID_SURVEY,
          get().survey?.slug!,
          {
            status,
          }
        );
      console.log("response", response);
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  getQuestionFromSlug: async (slug: string) => {
    set({ loading: true });
    try {
      const response = await useAppwrite
        .getState()
        .databaseService?.listDocuments(DATABASE_ID, COLLECTION_ID_QUESTION, [
          Query.equal("surveySlug", slug),
        ]);
      console.log("response", response);

      const fetchedQuestions = response?.documents.map(question => ({
        index: question.index,
        type: question.type,
        text: question.text,
        options: question?.options,
        surveySlug: question.surveySlug,
      }));

      // sort questions by index
      fetchedQuestions?.sort((a, b) => a.index - b.index);

      set({ questions: fetchedQuestions });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  submitSurvey: async res => {
    set({ loading: true });
    try {
      const response = await useAppwrite
        .getState()
        .databaseService?.updateDocument(
          DATABASE_ID,
          COLLECTION_ID_RESPONSE,
          ID.unique(),
          {
            surveySlug: get().survey?.slug,
            userEmail: get().userEmail,
            textResponses: res.textResponses,
            optionResponses: res.optionResponses,
          }
        );

      const surveyResponse = await useAppwrite
        .getState()
        .databaseService?.updateDocument(
          DATABASE_ID,
          COLLECTION_ID_SURVEY,
          get().survey?.slug!,
          {
            responseCount: get().survey?.responseCount! + 1,
          }
        );

      console.log("response", response);
      console.log("surveyResponse", surveyResponse);
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useSurvey;
