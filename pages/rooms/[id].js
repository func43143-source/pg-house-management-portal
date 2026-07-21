import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'

export default function EditRoom(){
  const router = useRouter()
  const { id } = router.query
  const [room, setRoom] = useState(null)
  const [number, setNumber] = useState('')
  const [type, setType] = useState('')
  const [rent, setRent] = useState(0)
  const [occupied, setOccupied] = useState(false)

  useEffect(()=>{ if(id) load() },[id])
  function load(){ fetch(`/api/rooms/${id}`).then(r=>r.json()).then(data=>{ setRoom(data); setNumber(data.number); setType(data.type); setRent(data.rent); setOccupied(data.occupied) }) }

  async function save(e){
    e.preventDefault()
    await fetch(`/api/rooms/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ number, type, rent, occupied }) })
    router.push('/rooms')
  }

  if(!room) return <Layout><p>Loading...</p></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Edit Room {room.number}</h1>
      <form onSubmit={save} className="bg-white p-4 rounded">
        <label className="block text-sm mb-1">Number</label>
        <input className="border p-2 w-full mb-2" value={number} onChange={(e)=>setNumber(e.target.value)} />
        <label className="block text-sm mb-1">Type</label>
        <input className="border p-2 w-full mb-2" value={type} onChange={(e)=>setType(e.target.value)} />
        <label className="block text-sm mb-1">Rent</label>
        <input type="number" className="border p-2 w-full mb-2" value={rent} onChange={(e)=>setRent(e.target.value)} />
        <label className="block mb-2"><input type="checkbox" checked={occupied} onChange={(e)=>setOccupied(e.target.checked)} /> Occupied</label>
        <button className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
      </form>
    </Layout>
  )
}
