import { create } from "zustand";
import { Client, Account, ID, Databases, Models } from "appwrite";
import axios from "axios";

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
  getMe: (callback?: () => void) => Promise<boolean>;

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
      set({ authLoading: false });
    } catch (error) {
      console.error(error);
      set({ authLoading: false });
      throw new Error("Could not Sign Up");
    }
  },
  getMe: async callback => {
    set({ authLoading: true });
    const accountService = get().accountService;

    if (!accountService) {
      throw new Error("Account service not initialized");
    }

    try {
      const me = await accountService.get();
      // if (!me) {
      //   set({ authLoading: false });
      //   console.log("User is not logged in");

      //   // user is not logged in
      //   return false;
      // }
      set({ me });
      callback && callback();
      set({ authLoading: false });
      return true;
    } catch (error) {
      set({ authLoading: false });
      console.log(error);
      return false;
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
      set({ authLoading: false });
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
      set({ authLoading: false });
    } catch (error) {
      console.error(error);
      set({ authLoading: false });
      throw new Error("Could not send verification email");
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
      set({ authLoading: false });
    } catch (error) {
      console.error(error);
      set({ authLoading: false });
      throw new Error("Could not verify email");
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

      return JSON.parse(result.data.data);
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useAppwrite;
