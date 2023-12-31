'use client'

import ExploreHeader from "@/components/exploreHeader";
import NavigationTest from "@/components/navigation";
import SideBar from "@/components/sideBar";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex">
      {/* <SideBar/> */}
      <NavigationTest/>
      <main className="flex-1 h-full overflow-y-auto bg-slate-200">
        <ExploreHeader/>
        {children}
      </main>
    </div>
  )
}