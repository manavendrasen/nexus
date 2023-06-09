import { create } from "zustand";
import { Client, Account, ID, Databases, Models, Functions } from "appwrite";
import axios from "axios";
import { FUNCTION_ID } from "@/constants/DatabaseIds";

interface AppwriteStore {
  // appwrite services
  clientService?: Client;
  accountService?: Account;
  databaseService?: Databases;

  // auth
  authLoading: boolean;
  me?: Models.User<Models.Preferences>;
  init: () => void;
  signUp: (data: SignUpFormState, callback?: () => void) => void;
  login: (data: LoginFormState, callback?: () => void) => void;
  sendVerificationEmail: () => void;
  confirmVerificationEmail: (userId: string, secret: string) => void;

  // survey
  // createMagicURLSession: (email: string) => void;
  // updateMagicURLSession: (userId: string, secret: string) => void;

  // function
  visualize: (surveyId: string) => Promise<any>;
}

type SignUpFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginFormState = {
  email: string;
  password: string;
};

const createClient = () => {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Your project ID
};

const useAppwrite = create<AppwriteStore>()((set, get) => ({
  clientService: undefined,
  accountService: undefined,
  databaseService: undefined,
  authLoading: false,
  me: undefined,
  init: () => {
    const client = createClient();
    const account = new Account(client);
    const database = new Databases(client);

    set({
      clientService: client,
      accountService: account,
      databaseService: database,
    });
    console.log("Appwrite initialized");
  },
  signUp: async (data: SignUpFormState, callback) => {
    set({ authLoading: true });

    const accountService = get().accountService;
    if (!accountService) {
      throw new Error("Account service not initialized");
    } else if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    try {
      await accountService.create(
        ID.unique(),
        data.email,
        data.password,
        data.name
      );
      callback && callback();
    } catch (error) {
      console.error(error);
      throw new Error("Could not Sign Up");
    } finally {
      set({ authLoading: false });
    }
  },
  login: async (data: LoginFormState, callback) => {
    set({ authLoading: true });
    const accountService = get().accountService;
    if (!accountService) {
      throw new Error("Account service not initialized");
    }

    try {
      await accountService.createEmailSession(data.email, data.password);
      const me = await accountService.get();
      set({ me });
      callback && callback();
    } catch (error) {
      console.error(error);
      throw new Error("Could not login");
    } finally {
      set({ authLoading: false });
    }
  },
  sendVerificationEmail: async () => {
    set({ authLoading: true });
    const accountService = get().accountService;
    if (!accountService) {
      throw new Error("Account service not initialized");
    }

    try {
      console.log(process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL);

      await accountService.createVerification(
        `${process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL}/sign-up/confirm`
      );
    } catch (error) {
      console.error(error);
      throw new Error("Could not send verification email");
    } finally {
      set({ authLoading: false });
    }
  },
  confirmVerificationEmail: async (userId, secret) => {
    set({ authLoading: true });
    const accountService = get().accountService;
    if (!accountService) {
      throw new Error("Account service not initialized");
    }

    try {
      await accountService.updateVerification(userId, secret);
    } catch (error) {
      console.error(error);
      throw new Error("Could not verify email");
    } finally {
      set({ authLoading: false });
    }
  },

  // createMagicURLSession: async email => {
  //   set({ authLoading: true });
  //   const accountService = get().accountService;
  //   if (!accountService) {
  //     throw new Error("Account service not initialized");
  //   }

  //   try {
  //     await accountService.createMagicURLSession(ID.unique(), email);
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("Could not create magic URL session");
  //   } finally {
  //     set({ authLoading: false });
  //   }
  // },
  // updateMagicURLSession: async (userId, secret) => {
  //   set({ authLoading: true });
  //   const accountService = get().accountService;
  //   if (!accountService) {
  //     throw new Error("Account service not initialized");
  //   }

  //   try {
  //     await accountService.updateMagicURLSession(userId, secret);
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("Could not update magic URL session");
  //   } finally {
  //     set({ authLoading: false });
  //   }
  // },
  visualize: async surveyId => {
    // get data from backend
    const response = await axios.get(`/api/survey?surveySlug=${surveyId}`);
    const surveyResponses = response.data;

    // format the data

    console.log("surveyResponses", surveyResponses);

    // call the function with the data
    const functions = new Functions(get().clientService!);
    const result = await functions.createExecution(
      FUNCTION_ID,
      JSON.stringify({
        responses: surveyResponses,
      })
    );

    //  const parsedResponse = response.rep.map(res => JSON.parse(res));
    console.log("result", JSON.parse(result.response));
  },
}));

export default useAppwrite;
