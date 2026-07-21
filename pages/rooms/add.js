import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

export default function AddRoom() {
  const [number, setNumber] = useState('')
  const [type, setType] = useState('Single')
  const [rent, setRent] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/check').then(r => r.json()).then(d => { if (!d.ok) router.push('/login') })
  }, [router])

  async function handle(e) {
    e.preventDefault()
    const payload = { number, type, rent: Number(rent) || 0 }
    await fetch('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    router.push('/rooms')
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Add Room</h1>
      <form onSubmit={handle} className="bg-white p-4 rounded max-w-md">
        <div className="mb-3">
          <label className="block text-sm mb-1">Number</label>
          <input className="border p-2 w-full" value={number} onChange={(e) => setNumber(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Type</label>
          <select className="border p-2 w-full" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Single</option>
            <option>Double</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Rent</label>
          <input className="border p-2 w-full" type="number" value={rent} onChange={(e) => setRent(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
          <button type="button" onClick={() => router.push('/rooms')} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
        </div>
      </form>
    </Layout>
  )
}
