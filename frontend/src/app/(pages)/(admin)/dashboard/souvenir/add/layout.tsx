export default function AddSouvenirAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h screen flex">
      <main className="flex-1 overflow-y-auto bg-slate-200">
        {children}
      </main>
    </div>
  )
}