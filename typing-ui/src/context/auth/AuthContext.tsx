import { createContext } from "react";
import type { AuthContextValues } from "./AuthInterface";

const defaultAuthContextValues: AuthContextValues = {
  authenticated: false,
  pdf_list: [],
  init: async () => {
    return;
  },
  signin: async (email: string, password: string) => {
    return false;
  },
  signup: async (email: string, password: string) => {
    return false;
  },
  signout: async () => {
    return;
  },
  uploadPdf: async (file: File) => {
    return false;
  },
  getPdfList: async () => {
    return;
  },
  getPdf: async (fileName:string) => {
    return null;
  },
  deletePdf: async (fileName: string) => {
    return false;
  },
};

const AuthContext = createContext<AuthContextValues>(defaultAuthContextValues);

export default AuthContext;
