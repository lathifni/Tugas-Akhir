import { ReactNode } from "react";
import AppBar from "@/components/appBar";
import AuthProvider from "../../../../provider/authProvider";

interface IProps {
  children: ReactNode;
}

export default function RootLayout({ children }: IProps) {
  return (
    <AuthProvider>
      <AppBar/>
        <div className={"  min-h-screen "}>
        {children}
      </div>
    </AuthProvider>
  );
}