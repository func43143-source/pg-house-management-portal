import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'

export default function Complaints(){
  const [complaints, setComplaints] = useState([])
  const [tenants, setTenants] = useState([])
  const [rooms, setRooms] = useState([])
  const [tenantId, setTenantId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(()=>{ fetch('/api/auth/check').then(r=>r.json()).then(d=>{ if(!d.ok) window.location = '/login' }); load() }, [])
  function load(){ fetch('/api/complaints').then(r=>r.json()).then(setComplaints); fetch('/api/tenants').then(r=>r.json()).then(setTenants); fetch('/api/rooms').then(r=>r.json()).then(setRooms) }

  async function add(e){ e.preventDefault(); await fetch('/api/complaints', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ tenantId: tenantId||null, roomId: roomId||null, description: desc }) }); setDesc(''); load() }

  async function updateStatus(id, status){ await fetch(`/api/complaints/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status }) }); load() }
  async function del(id){ if(!confirm('Delete?')) return; await fetch(`/api/complaints/${id}`, { method: 'DELETE' }); load() }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Complaints</h1>
      <div className="bg-white p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Add Complaint</h2>
        <form className="flex gap-2" onSubmit={add}>
          <select value={tenantId} onChange={(e)=>setTenantId(e.target.value)} className="border p-2">
            <option value="">Tenant (optional)</option>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={roomId} onChange={(e)=>setRoomId(e.target.value)} className="border p-2">
            <option value="">Room (optional)</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.number}</option>)}
          </select>
          <input value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Description" className="border p-2 flex-1" />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded">
        <h2 className="font-semibold mb-2">All Complaints</h2>
        <table className="w-full">
          <thead className="border-b"><tr><th className="p-2">Tenant</th><th>Room</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id} className="border-b align-top">
                <td className="p-2">{c.tenant?.name || '-'}</td>
                <td>{c.room?.number || '-'}</td>
                <td>{c.description}</td>
                <td>{c.status}</td>
                <td>
                  <button onClick={()=>updateStatus(c.id,'RESOLVED')} className="mr-2 text-sm bg-green-200 px-2 rounded">Mark Resolved</button>
                  <button onClick={()=>updateStatus(c.id,'OPEN')} className="mr-2 text-sm bg-yellow-200 px-2 rounded">Reopen</button>
                  <button onClick={()=>del(c.id)} className="text-sm bg-red-200 px-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
