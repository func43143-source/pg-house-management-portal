import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'

export default function Rents() {
  const [payments, setPayments] = useState([])
  const [tenants, setTenants] = useState([])
  const [pending, setPending] = useState([])
  const [tenantId, setTenantId] = useState('')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState('')

  useEffect(() => {
    fetch('/api/auth/check').then(r => r.json()).then(d => { if (!d.ok) window.location = '/login' })
    load()
  }, [])

  function load() {
    fetch('/api/rents').then(r => r.json()).then(setPayments)
    fetch('/api/tenants').then(r => r.json()).then(setTenants)
    fetch('/api/rents/pending').then(r => r.json()).then(setPending)
  }

  async function record(e) {
    e.preventDefault()
    await fetch('/api/rents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenantId, amount, month }) })
    setTenantId('')
    setAmount('')
    setMonth('')
    load()
  }

  function fillForTenant(t) {
    setTenantId(t.id)
    setAmount(t.room?.rent || '')
    setMonth(t.month)
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Rent Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded">
          <h2 className="font-semibold mb-2">Record Payment</h2>
          <form className="flex gap-2 flex-wrap" onSubmit={record}>
            <select value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="border p-2">
              <option value="">Select tenant</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name} ({t.room ? t.room.number : '-'})</option>)}
            </select>
            <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="border p-2" />
            <input placeholder="Month (YYYY-MM)" value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2" />
            <button className="bg-blue-600 text-white px-3 py-1 rounded">Record</button>
          </form>

          <div className="mt-4">
            <h3 className="font-medium">Pending Payments (this month)</h3>
            {pending.length === 0 ? (
              <div className="text-sm text-gray-500">No pending payments</div>
            ) : (
              <ul className="mt-2 space-y-2">
                {pending.map(p => (
                  <li key={p.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <div className="font-medium">{p.name} {p.room ? `(${p.room.number})` : ''}</div>
                      <div className="text-sm text-gray-500">{p.email || p.phone}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => fillForTenant(p)} className="text-sm bg-green-200 px-2 py-1 rounded">Record</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded">
          <h2 className="font-semibold mb-2">Payment History</h2>
          <table className="w-full">
            <thead className="border-b"><tr><th className="p-2">Tenant</th><th>Amount</th><th>Month</th><th>Date</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b"><td className="p-2">{p.tenant?.name}</td><td>{p.amount}</td><td>{p.month}</td><td>{new Date(p.paidAt).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </Layout>
  )
}
