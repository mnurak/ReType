export interface AuthContextValues {
  authenticated: boolean;
  pdf_list: string[];
  init: () => Promise<void>;
  signin: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  signout: () => Promise<void>;
  uploadPdf: (file:File) => Promise<boolean>;
  getPdfList: () => Promise<void>;
  getPdf: (fileName:string) => Promise<File | null>;
  deletePdf: (fileName:string) => Promise<boolean>;
}
