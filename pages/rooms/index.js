import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'

export default function Rooms() {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    fetch('/api/auth/check').then(r => r.json()).then(d => { if (!d.ok) window.location = '/login' })
    load()
  }, [])

  function load() {
    fetch('/api/rooms').then(r => r.json()).then(setRooms)
  }

  async function removeRoom(id) {
    if (!confirm('Delete room?')) return
    await fetch(`/api/rooms/${id}`, { method: 'DELETE' })
    load()
  }

  async function toggleOccupy(room) {
    await fetch(`/api/rooms/${room.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: room.number, type: room.type, rent: room.rent, occupied: !room.occupied })
    })
    load()
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <Link href="/rooms/add" className="bg-green-600 text-white px-3 py-1 rounded">Add Room</Link>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left border-b">
            <tr>
              <th className="p-3">Number</th>
              <th className="p-3">Type</th>
              <th className="p-3">Rent</th>
              <th className="p-3">Occupied</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{r.number}</td>
                <td className="p-3">{r.type || '-'}</td>
                <td className="p-3">{r.rent}</td>
                <td className="p-3">{r.occupied ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  <Link href={`/rooms/${r.id}`} className="text-blue-600 mr-2">Edit</Link>
                  <button onClick={() => toggleOccupy(r)} className="bg-gray-200 text-sm px-2 py-1 rounded mr-2">Toggle Occupied</button>
                  <button onClick={() => removeRoom(r.id)} className="bg-red-200 text-sm px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rooms.length === 0 && <div className="p-4 text-gray-500">No rooms yet.</div>}
      </div>
    </Layout>
  )
}
