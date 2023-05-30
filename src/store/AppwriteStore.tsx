import { create } from "zustand";
import { Client, Account, ID, Databases, Models } from "appwrite";

interface AppwriteStore {
  clientService: Client | null;
  accountService: Account | null;
  databaseService: Databases | null;
  init: () => void;
  signUp: (data: SignUpFormState) => Promise<Models.User<Models.Preferences>>;
  login: (data: LoginFormState) => Promise<Models.Session>;
  sendVerificationEmail: () => void;
  confirmVerificationEmail: (userId: string, secret: string) => void;
  fetchMe: () => void;
  authLoading: boolean;
  me: Models.User<Models.Preferences> | null;
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
  clientService: null as Client | null,
  accountService: null as Account | null,
  databaseService: null as Databases | null,
  authLoading: false,
  me: {
    name: "Manavendra Sen",
    email: "manavendra4288@gmail.com",
    emailVerification: true,
  } as Models.User<Models.Preferences> | null,
  init: () => {
    const client = createClient();
    const account = new Account(client);
    const database = new Databases(client);

    set({
      clientService: client,
      accountService: account,
      databaseService: database,
    });
  },
  signUp: async (data: SignUpFormState) => {
    set({ authLoading: true });

    const accountService = get().accountService;
    if (!accountService) {
      throw new Error("Account service not initialized");
    } else if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    try {
      return await accountService.create(
        ID.unique(),
        data.email,
        data.password,
        data.name
      );
    } catch (error) {
      console.error(error);
      throw new Error("Could not Sign Up");
    } finally {
      set({ authLoading: false });
    }
  },
  login: async (data: LoginFormState) => {
    set({ authLoading: true });
    const accountService = get().accountService;
    if (!accountService) {
      throw new Error("Account service not initialized");
    }

    try {
      return await accountService.createEmailSession(data.email, data.password);
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
  fetchMe: async () => {
    set({ authLoading: true });
    const accountService = get().accountService;
    if (!accountService) {
      throw new Error("Account service not initialized");
    }

    try {
      const user = await accountService.get();
      set({ me: user });
    } catch (error) {
      console.error(error);
      throw new Error("Could not get user");
    } finally {
      set({ authLoading: false });
    }
  },
}));

export default useAppwrite;
