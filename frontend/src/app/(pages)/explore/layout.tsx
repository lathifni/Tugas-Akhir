'use client'

import ExploreHeader from "@/components/exploreHeader";
import Footer from "@/components/footer";
import NavigationTest from "@/components/navigation";
import SideBar from "@/components/sideBar";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //tadi h-full
    <div className="h-screen flex">
      {/* <SideBar/> */}
      <NavigationTest/>
      <main className="flex-1 h-full overflow-y-auto bg-slate-200">
        <ExploreHeader/>
        {children}
      </main>
    </div>
  )
}