import React, { useEffect, useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'

export default function DealershipsPage(){
  const { t } = useLocale()
  const [items, setItems] = useState([])
  useEffect(()=>{
    let mounted = true
    api.fetchDealerships().then(r=>{ if (mounted && r && r.results) setItems(r.results) }).catch(()=>{})
    return ()=>{ mounted = false }
  },[])
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">{t('pages.dealerships')}</h1>
        <div className="space-y-4 mt-4">
          {items.length === 0 && <p className="text-gray-600">No dealerships yet.</p>}
          {items.map(d=> (
            <div key={d._id} className="p-4 bg-white border rounded">
              <h3 className="font-semibold">{d.name}</h3>
              <p className="text-sm text-gray-600">{d.location}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
