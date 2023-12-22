import { ReactNode } from "react";
import AppBar from "@/components/appBar";
import AuthProvider from "../../../../context/provider";

interface IProps {
  children: ReactNode;
}

export default function RootLayout({ children }: IProps) {
  return (
    <AuthProvider>
      {/* <html lang="en"> */}
      {/* <body suppressHydrationWarning={true}> */}
      <AppBar/>
        <div className={"  min-h-screen "}>
        {children}
      </div>
      {/* </body> */}
      {/* </html> */}
    </AuthProvider>
  );
}