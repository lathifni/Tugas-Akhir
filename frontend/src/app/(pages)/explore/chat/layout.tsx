'use client'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className="flex-1 bg-slate-200">
        {children}
      </main>
    </div>
  )
}