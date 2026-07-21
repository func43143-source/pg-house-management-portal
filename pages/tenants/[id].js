import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

export default function EditTenant() {
  const router = useRouter()
  const { id } = router.query
  const [tenant, setTenant] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [roomId, setRoomId] = useState('')
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    fetch('/api/auth/check').then(r => r.json()).then(d => { if (!d.ok) router.push('/login') })
    fetch('/api/rooms').then(r => r.json()).then(setRooms)
    if (id) load()
  }, [id, router])

  function load() {
    fetch(`/api/tenants/${id}`).then(r => r.json()).then(data => {
      setTenant(data)
      setName(data.name)
      setPhone(data.phone || '')
      setEmail(data.email || '')
      setRoomId(data.roomId || '')
    })
  }

  async function save(e) {
    e.preventDefault()
    const payload = { name, phone, email, roomId: roomId || null }
    await fetch(`/api/tenants/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    router.push('/tenants')
  }

  if (!tenant) return <Layout><p>Loading...</p></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Edit Tenant</h1>
      <form onSubmit={save} className="bg-white p-4 rounded max-w-md">
        <div className="mb-3">
          <label className="block text-sm mb-1">Name</label>
          <input className="border p-2 w-full" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Phone</label>
          <input className="border p-2 w-full" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input className="border p-2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Assign Room (optional)</label>
          <select className="border p-2 w-full" value={roomId || ''} onChange={(e) => setRoomId(e.target.value)}>
            <option value="">-- None --</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.number} ({r.occupied ? 'Occupied' : 'Vacant'})</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Tenant</button>
          <button type="button" onClick={() => router.push('/tenants')} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
        </div>
      </form>
    </Layout>
  )
}
