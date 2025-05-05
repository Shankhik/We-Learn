import type { Metadata } from "next";
import "./global.css";
import { AuthProvider } from "@/context/authContext";
import { ColorContextProvider } from "@/context/colorScheme";
import { UserDetailsProvider } from "@/context/userDetailsContext";
export const metadata: Metadata = {
  title: "We learn",
  description: "An E-Learning app made using NextJS"
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
      <UserDetailsProvider>
      <AuthProvider>
      <ColorContextProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
      </ColorContextProvider>
      </AuthProvider>
      </UserDetailsProvider>
    );
}
