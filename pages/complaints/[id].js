import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

export default function ComplaintEdit() {
  const router = useRouter()
  const { id } = router.query
  const [complaint, setComplaint] = useState(null)
  const [tenants, setTenants] = useState([])
  const [rooms, setRooms] = useState([])
  const [description, setDescription] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [status, setStatus] = useState('OPEN')

  useEffect(() => {
    fetch('/api/auth/check').then(r => r.json()).then(d => { if (!d.ok) router.push('/login') })
  }, [])

  useEffect(() => {
    if (!id) return
    load()
  }, [id])

  function load() {
    fetch(`/api/complaints/${id}`).then(r => r.json()).then(data => {
      setComplaint(data)
      setDescription(data?.description || '')
      setTenantId(data?.tenant?.id || '')
      setRoomId(data?.room?.id || '')
      setStatus(data?.status || 'OPEN')
    })
    fetch('/api/tenants').then(r => r.json()).then(setTenants)
    fetch('/api/rooms').then(r => r.json()).then(setRooms)
  }

  async function save(e) {
    e.preventDefault()
    await fetch(`/api/complaints/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description, tenantId: tenantId || null, roomId: roomId || null, status }) })
    router.push('/complaints')
  }

  async function remove() {
    if (!confirm('Delete complaint?')) return
    await fetch(`/api/complaints/${id}`, { method: 'DELETE' })
    router.push('/complaints')
  }

  if (!complaint) return (
    <Layout>
      <div>Loading...</div>
    </Layout>
  )

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Edit Complaint</h1>
      <div className="bg-white p-4 rounded">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Tenant</label>
            <select value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="border p-2 w-full">
              <option value="">None</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Room</label>
            <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="border p-2 w-full">
              <option value="">None</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.number}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full" rows={4} />
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 w-full">
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
            <button type="button" onClick={() => router.push('/complaints')} className="px-3 py-1 border rounded">Cancel</button>
            <button type="button" onClick={remove} className="ml-auto bg-red-200 px-3 py-1 rounded">Delete</button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
