import type { Metadata } from "next";
import "./global.css";
import { AuthProvider } from "@/context/authContext";
export const metadata: Metadata = {
  title: "We learn",
  description: "An E-Learning app made using NextJS",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
      <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
      </AuthProvider>
    );
}
