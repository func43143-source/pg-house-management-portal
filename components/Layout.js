import React from 'react'
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-white">
      <aside className="w-56 bg-gray-100 p-4">
        <h2 className="font-bold text-lg mb-4">PG Admin</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <Link className="px-2 py-1 rounded hover:bg-gray-200" href="/">Dashboard</Link>
          <Link className="px-2 py-1 rounded hover:bg-gray-200" href="/rooms">Rooms</Link>
          <Link className="px-2 py-1 rounded hover:bg-gray-200" href="/tenants">Tenants</Link>
          <Link className="px-2 py-1 rounded hover:bg-gray-200" href="/rents">Rents</Link>
          <Link className="px-2 py-1 rounded hover:bg-gray-200" href="/complaints">Complaints</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 container">{children}</main>
    </div>
  )
}
