import { create } from "zustand";
import { ID, Query } from "appwrite";
import useAppwrite from "./AppwriteStore";

// types and constants
import Survey from "@/constants/Survey";
import {
  COLLECTION_ID_QUESTION,
  COLLECTION_ID_RESPONSE,
  COLLECTION_ID_SURVEY,
  DATABASE_ID,
} from "@/constants/DatabaseIds";
import Question from "@/constants/Question";
import { PersonalQuestions } from "@/constants/PersonalQuestions";
import Response from "@/constants/Response";
import axios from "axios";

interface SurveyStore {
  loading: boolean;
  userEmail: string;
  questions: Question[];
  responses: Response[];
  survey?: Survey;

  setUserEmail: (email: string) => void;
  setSurvey: (survey: Survey) => void;
  getSurvey: (slug: string) => void;
  updateSurveyResponseCount: () => void;

  // dashboard
  getSurveys: (callback?: () => void) => void;
  allMySurveys: Survey[];
  updateQuestion: (question: Question, callback?: () => void) => void;
  deleteQuestion: (question: Question, callback?: () => void) => void;
  createSurvey: (survey: Survey, callback?: () => void) => void;
  addQuestion: (question: Question) => void;
  createQuestion: (question: Question) => void;
  updateSurveyStatus: (status: string, callback: () => void) => void;
  getResponses: (surveyId: string, callback?: () => void) => void;
  // function
  visualize: (surveyId: string) => Promise<any>;
}

const useSurvey = create<SurveyStore>()((set, get) => ({
  loading: false,
  userEmail: "",
  survey: undefined,
  questions: [],
  responses: [],
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
  getSurveys: async callback => {
    set({ loading: true });
    try {
      const me = await useAppwrite.getState().accountService?.get();

      if (!me) throw new Error("User not found");

      console.log("me", me.$id);

      const response = await useAppwrite
        .getState()
        .databaseService?.listDocuments(DATABASE_ID, COLLECTION_ID_SURVEY, [
          Query.equal("createdBy", me.$id),
        ]);
      console.log("response", response);

      if (!response) throw new Error("Survey not found");

      let fetchedSurveys = response.documents;

      // sort fetched document by createdAt
      fetchedSurveys.sort((a, b) => {
        return (
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
        );
      });

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
      callback && callback();
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  getSurvey: async (slug: string) => {
    set({ loading: true });
    try {
      console.log("slug", slug);

      const response = await useAppwrite
        .getState()
        .databaseService?.listDocuments(DATABASE_ID, COLLECTION_ID_SURVEY, [
          Query.equal("slug", slug),
        ]);

      console.log("response", response);

      if (!response) throw new Error("Survey not found, response undefined");

      if (response.documents.length === 0) {
        throw new Error("Survey not found, responses length 0");
      }

      const questionResponse = await useAppwrite
        .getState()
        .databaseService?.listDocuments(DATABASE_ID, COLLECTION_ID_QUESTION, [
          Query.equal("surveySlug", slug),
        ]);
      console.log("questionResponse", questionResponse);

      const fetchedQuestions = questionResponse?.documents.map(question => ({
        index: question.index,
        type: question.type,
        text: question.text,
        options: question?.options,
        surveySlug: question.surveySlug,
      }));

      const fetchedSurvey = response.documents[0];

      // sort questions by index
      fetchedQuestions?.sort((a, b) => a.index - b.index);

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
        questions: fetchedQuestions,
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
  createSurvey: async (survey: Survey, callback) => {
    set({ loading: true });
    try {
      const me = await useAppwrite.getState().accountService?.get();

      if (!me) throw new Error("User not found");

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
            status: survey.status,
            createdBy: me.$id,
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
              surveySlug: survey.slug,
            }
          );
      });

      const personalQuestionResponse = await Promise.all(
        personalQuestionPromises
      );

      console.log("response", response);
      console.log("personalQuestionResponse", personalQuestionResponse);
      callback && callback();
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  updateSurveyStatus: async (status: string, callback) => {
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
      callback();
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  updateSurveyResponseCount: async () => {
    set({ loading: true });
    try {
      // const response = await useAppwrite
      //   .getState()
      //   .databaseService?.updateDocument(
      //     DATABASE_ID,
      //     COLLECTION_ID_RESPONSE,
      //     ID.unique(),
      //     {
      //       surveySlug: get().survey?.slug,
      //       userEmail: get().userEmail,
      //       textResponses: res.textResponses,
      //       optionResponses: res.optionResponses,
      //       coordinates: res.coordinates,
      //     }
      //   );

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

      console.log("surveyResponse", surveyResponse);
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  updateQuestion: async (question: Question, callback) => {
    set({ loading: true });
    try {
      const questionResponse = await useAppwrite
        .getState()
        .databaseService?.listDocuments(DATABASE_ID, COLLECTION_ID_QUESTION, [
          Query.equal("surveySlug", question.surveySlug!),
          Query.equal("index", question.index!),
        ]);

      if (!questionResponse) throw new Error("Question not found");

      const questionId = questionResponse?.documents[0].$id;

      const response = await useAppwrite
        .getState()
        .databaseService?.updateDocument(
          DATABASE_ID,
          COLLECTION_ID_QUESTION,
          questionId,
          {
            index: Number(question.index),
            type: question.type,
            text: question.text,
            options: question?.options || [],
          }
        );
      console.log("response", response);
      callback && callback();
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  deleteQuestion: async (question: Question, callback) => {
    set({ loading: true });
    try {
      const questionResponse = await useAppwrite
        .getState()
        .databaseService?.listDocuments(DATABASE_ID, COLLECTION_ID_QUESTION, [
          Query.equal("surveySlug", question.surveySlug!),
          Query.equal("index", question.index!),
        ]);

      if (!questionResponse) throw new Error("Question not found");

      const questionId = questionResponse?.documents[0].$id;

      const response = await useAppwrite
        .getState()
        .databaseService?.deleteDocument(
          DATABASE_ID,
          COLLECTION_ID_QUESTION,
          questionId
        );
      console.log("response", response);
      callback && callback();
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  getResponses: async (surveyId: string, callback) => {
    set({ loading: true });
    try {
      const response = await useAppwrite
        .getState()
        .databaseService?.listDocuments(DATABASE_ID, COLLECTION_ID_RESPONSE, [
          Query.equal("surveySlug", surveyId),
        ]);

      if (!response) throw new Error("Response not found");

      const formattedResponses = response.documents.map(res => {
        return {
          name: res.name,
          surveySlug: res.surveySlug,
          userEmail: res.userEmail,
          textResponses: res.textResponses,
          optionResponses: res.optionResponses,
          coordinates: res.coordinates,
        };
      });

      set({ responses: formattedResponses });
      callback && callback();
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },
  visualize: async surveyId => {
    // get data from backend
    set({ loading: true });
    const response = await axios.get(`/api/survey?surveySlug=${surveyId}`);
    const surveyResponses = response.data;

    // format the data
    console.log("surveyResponses", surveyResponses);

    type responseObjType = {
      [email: string]: {
        textResponses: string[];
        optionResponses: number[];
        coordinates: number[];
      };
    };

    // call the lambda function with the data
    let responseWithCoordinates: responseObjType[] = [];
    try {
      const result = await axios.post(
        process.env.NEXT_PUBLIC_PLOT_API_URL!,
        {
          responses: surveyResponses.response,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // now we have coordinates
      responseWithCoordinates = JSON.parse(result.data.data);

      console.log("responseWithCoordinates", responseWithCoordinates);

      // save the data to the database
      try {
        const databaseService = useAppwrite.getState().databaseService;

        if (!databaseService) {
          set({ loading: false });
          throw new Error("Database service not initialized");
        }

        // promise array
        const responsesList: Response[] = [];
        const ResponseDatabasePromises = responseWithCoordinates.map(
          (responseObj: responseObjType) => {
            const email = Object.keys(responseObj)[0];
            const responseObjValues = responseObj[email];
            const payload: Response = {
              surveySlug: surveyId,
              userEmail: email,
              textResponses: responseObjValues["textResponses"],
              optionResponses: responseObjValues["optionResponses"],
              coordinates: responseObjValues["coordinates"],
              name: responseObjValues["textResponses"][0],
            };

            responsesList.push(payload);
            return databaseService.createDocument(
              DATABASE_ID,
              COLLECTION_ID_RESPONSE,
              ID.unique(),
              payload
            );
          }
        );

        set({ responses: responsesList });

        // wait for all promises to resolve
        const response = await Promise.all(ResponseDatabasePromises);

        console.log("ResponseDatabasePromises", response);

        set({ loading: false });
        return responseWithCoordinates;
      } catch (error) {
        set({ loading: false });
        console.log(error);
      }
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },
}));

export default useSurvey;
