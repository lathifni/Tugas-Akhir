import React from "react";
import NavBarLandingPage from "./_components/navBar";
import FooterLandingPage from "./_components/footer";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="h-full pt-16">
      <NavBarLandingPage/>
      {children}
      <FooterLandingPage/>
    </main>
  )
}