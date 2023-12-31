export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex">
      <main className="flex-1 h-full overflow-y-auto bg-slate-200">
        {children}
      </main>
    </div>
  )
}