'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const params = useSearchParams()
  const [pending, setPending] = useState(false)
  const reason = params.get('reason')
  const error = params.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-cyan-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">常宏祥隆机械</h1>
          <p className="mt-2 text-sm text-slate-500">网站管理后台登录</p>
          <p className="mt-1 text-xs text-slate-400">登录后将自动进入管理后台，只需登录一次</p>
        </div>

        {reason === 'unauthorized' && (
          <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
            请先登录后再访问管理后台
          </p>
        )}

        <form
          action="/api/auth/login"
          method="post"
          className="space-y-4"
          onSubmit={() => setPending(true)}
        >
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              邮箱
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-800 disabled:opacity-60"
          >
            {pending ? '登录中…' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">加载中…</div>}>
      <LoginForm />
    </Suspense>
  )
}
