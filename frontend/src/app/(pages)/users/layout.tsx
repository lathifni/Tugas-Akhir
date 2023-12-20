import { ReactNode } from "react";
import Provider from "../../../../context/provider";
import AppBar from "@/components/appBar";
import { SessionProvider } from "next-auth/react";
import UserPage from "./page";
import AuthProvider from "../../../../context/provider";

interface IProps {
    children: ReactNode;
  }

  export default function RootLayout({ children }: IProps) {
    return (
      <html lang="en">
          <body suppressHydrationWarning={true}>
            <div className={"  min-h-screen "}>
              <AuthProvider>
                {children}
              </AuthProvider>
            </div>
          </body>
      </html>
    );
  }