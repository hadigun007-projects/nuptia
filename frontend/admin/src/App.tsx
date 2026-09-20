import React, { useState, useEffect } from 'react'

export default function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/')

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash || '#/')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center">
      <div className="text-center p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
        <h1 className="text-2xl font-bold text-primary mb-2">Nuptia Admin</h1>
        <p className="text-sm text-on-surface-variant">Admin Internal Dashboard Initialized</p>
      </div>
    </div>
  )
}
