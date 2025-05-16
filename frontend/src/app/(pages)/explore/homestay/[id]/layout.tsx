import Footer from "@/components/footer";

export default function HomestayIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex">
      <main className="flex-1 h-full overflow-y-visible bg-slate-200">
        {children}
        {/* <Footer/> */}
      </main>
    </div>
  )
}