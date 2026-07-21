import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/check').then(res => res.json()).then(data => { if (!data.ok) router.push('/login') })
    fetch('/api/summary')
      .then((r) => r.json())
      .then((data) => setSummary(data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card title="Total Rooms" value={summary?.totalRooms ?? 0} />
          <Card title="Occupied Rooms" value={summary?.occupiedRooms ?? 0} />
          <Card title="Vacant Rooms" value={summary?.vacantRooms ?? 0} />
          <Card title="Total Tenants" value={summary?.totalTenants ?? 0} />
          <Card title="Pending Rent Payments" value={summary?.pendingPayments ?? 0} />
          <Card title="Open Complaints" value={summary?.openComplaints ?? 0} />
        </div>
      )}
    </Layout>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  )
}
