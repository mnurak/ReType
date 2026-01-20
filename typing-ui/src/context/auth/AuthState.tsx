import { useState, type ReactNode } from "react";
import AuthContext from "./AuthContext";
import type { AuthContextValues } from "./AuthInterface";

const AuthState = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [pdf_list, setPdf_list] = useState<string[]>([]);

  const init = async () => {
    const cookies = document.cookie;
    console.log(cookies);

    if (cookies.includes("access_token")) {
      console.log("Cookie exists!");
      setAuthenticated(true);
      // must get the list of pdfs from the user
    } else {
      setAuthenticated(false);
      console.log("No access_token cookie found.");
    }
  };

  const signin = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      if (res.ok) {
        setAuthenticated(true);
        getPdfList();
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const signup = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });
      if (res.ok) {
        setAuthenticated(true);
        getPdfList();
        return true;
      }
      if (res.status == 401) console.log("user Already exist");
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const signout = async () => {
    const res = await fetch("/api/auth/signout", {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setAuthenticated(false);
      setPdf_list([]);
    }
  };

  const uploadPdf = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/doc/add", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    if (data) {
      getPdfList();
      return true;
    }
    console.log(res.status);
    return false;
  };

  const getPdfList = async () => {
    const res = await fetch("/api/doc/getList", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (data) {
      setPdf_list(data.files);
    } else setPdf_list([]);
  };

  const getPdf = async (fileName: string) => {
    const res = await fetch(`/api/doc/get/${fileName}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }
    const blob = await res.blob(); // 👈 this is the PDF
    const file: File = new File([blob], fileName, {
      type: "application/pdf",
      lastModified: Date.now(),
    });

    return file;
  };

  const deletePdf = async (fileName: string) => {
    const res = await fetch(`/api/doc/delete/${fileName}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.status == 200) {
      getPdfList();
      return true;
    }
    return false;
  };

  const value: AuthContextValues = {
    authenticated,
    pdf_list,
    init,
    signin,
    signup,
    signout,
    uploadPdf,
    getPdfList,
    getPdf,
    deletePdf,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthState;
