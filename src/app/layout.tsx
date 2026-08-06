import type { Metadata } from "next";
import "./global.css";
import { AuthProvider } from "@/context/authContext";
import { ColorContextProvider } from "@/context/colorScheme";
import ReactQueryProvider from "@/context/reactQuery";
import { ScreenDimensionsProvider } from "@/context/screenWidth";
import { NotificationProvider } from "@/context/notification";
import { Nunito_Sans } from "next/font/google"
import PopupAlert from "@/components/notification/popup";
import { cookies } from "next/headers";

import verifyUser from "@/context/server-actions/verify";

export const metadata: Metadata = {
  title: "We Learn",
  description: "An E-Learning app made using NextJS"
};

const nunito = Nunito_Sans({
  subsets:['latin'],
  variable: '--Nunito'
});

export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  // Gets Theme Cookie from Client;
  const parsedTheme = await parseThemeCookie();
  const parsedDimension = await parseDimensionCookie();
  return (
    <AuthProvider userCredentialsPromise={
      verifyUser(undefined,false)
    }>
    <ColorContextProvider initial={parsedTheme}>
    <ReactQueryProvider>
    <ScreenDimensionsProvider initialDimension={parsedDimension}>
    <NotificationProvider>
    <html lang="en" className={nunito.variable}>
      <head>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      </head>
      
      <body>
        <PopupAlert/>
        {children}
      </body>
    </html>
    </NotificationProvider>
    </ScreenDimensionsProvider>
    </ReactQueryProvider>
    </ColorContextProvider>
    </AuthProvider>
  );
}

const parseDimensionCookie = async()=>{
  let cookie = (await cookies()).get("DIMENSIONS")?.value
  // const regex = /^w_(\d+)\s+h_(\d+)$/
  const regex= /\b([wh])_(\d+)\b/g ; // g: for parsing through it
  
  if (!cookie) return {
    width: null, height: null
  };
  const result: {width: null|number, height: null|number} = {
    width: null, height: null
  };

  cookie = cookie.trim();

  for (const match of cookie.matchAll(regex)){
    const [, type, value] = match;
    if (type === "w"){
      result.width = Number(value);
    }else if (type === "h"){
      result.height = Number(value);
    }
  }
  return result;
}
const parseThemeCookie = async (): Promise<{
  theme: "light"|"dark"|"default",
  effectiveTheme: "light"|"dark"
}> =>{
  let cookie = (await cookies()).get("THEME")?.value
  try {
    if (!cookie) throw new Error("no cookie");
    cookie = cookie.toLocaleLowerCase();

    // Normal Theme
    if (cookie === "light" || cookie === "dark") return {
      theme: cookie,
      effectiveTheme: cookie
    }
    
    if (cookie === "default-light") return {
      theme: "default",
      effectiveTheme: "light"
    }
    if (cookie === "default-dark") return {
      theme: "default",
      effectiveTheme: "dark"
    }
    throw new Error("Invalid cookie value");
  } catch (error: any) {
    return {
      theme: "default",
      effectiveTheme: "light"
    };
  }
}
