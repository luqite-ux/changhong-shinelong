export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 [&_input]:bg-white [&_input]:text-slate-900 [&_input]:placeholder:text-slate-400">
      {children}
    </div>
  )
}
