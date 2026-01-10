import React, { useEffect, useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'

export default function Classifieds(){
  const { t } = useLocale()
  const [items, setItems] = useState([])
  useEffect(() => {
    let mounted = true
    api.fetchClassifieds().then(r => { if (mounted && r && r.results) setItems(r.results) }).catch(() => {})
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{t('pages.classifieds')}</h1>
        <div className="space-y-4">
          {items.length === 0 && <p className="text-gray-600">No classifieds yet.</p>}
          {items.map(it => (
            <div key={it._id} className="p-4 border rounded bg-white">
              <h3 className="font-semibold">{it.title}</h3>
              <p className="text-sm text-gray-600">{it.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
