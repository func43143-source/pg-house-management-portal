import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'

export default function Tenants() {
  const [tenants, setTenants] = useState([])

  useEffect(() => {
    fetch('/api/auth/check').then(r => r.json()).then(d => { if (!d.ok) window.location = '/login' })
    load()
  }, [])

  function load() {
    fetch('/api/tenants').then(r => r.json()).then(setTenants)
  }

  async function removeTenant(id) {
    if (!confirm('Delete tenant?')) return
    await fetch(`/api/tenants/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <Link href="/tenants/add" className="bg-green-600 text-white px-3 py-1 rounded">Add Tenant</Link>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Room</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{t.name}</td>
                <td className="p-3">{t.phone || '-'}</td>
                <td className="p-3">{t.room ? t.room.number : '-'}</td>
                <td className="p-3">
                  <Link href={`/tenants/${t.id}`} className="text-blue-600 mr-2">Edit</Link>
                  <button onClick={() => removeTenant(t.id)} className="bg-red-200 text-sm px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tenants.length === 0 && <div className="p-4 text-gray-500">No tenants yet.</div>}
      </div>
    </Layout>
  )
}
