import ExploreHeader from "@/components/exploreHeader";
import NavigationAdmin from "@/components/navigationAdmin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h screen flex">
      <NavigationAdmin />
      <main className="flex-1 overflow-y-auto bg-slate-200">
        <ExploreHeader />
        <div style={{ overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
          {children}
        </div>
      </main>
    </div>
  )
}