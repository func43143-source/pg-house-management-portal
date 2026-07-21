import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      router.push('/')
    } else {
      const data = await res.json()
      setError(data.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="border p-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-blue-600 text-white py-2 rounded">Login</button>
          {error && <p className="text-red-600">{error}</p>}
        </form>
        <p className="text-sm mt-4 text-gray-600">Use username: <strong>admin</strong> password: <strong>admin123</strong></p>
      </div>
    </div>
  )
}
