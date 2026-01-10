import React, { useEffect, useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'

export default function Reviews(){
  const { t } = useLocale()
  const [items, setItems] = useState([])
  useEffect(()=>{
    let mounted = true
    api.fetchReviews().then(r=>{ if (mounted && r && r.results) setItems(r.results) }).catch(()=>{})
    return ()=>{ mounted = false }
  },[])
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{t('pages.reviews')}</h1>
        <div className="space-y-4 mt-2">
          {items.length === 0 && <p className="text-gray-600">No reviews yet.</p>}
          {items.map(it=> (
            <div key={it._id} className="p-4 bg-white border rounded">
              <div className="flex items-center justify-between">
                <strong>{it.rating || '—'}/5</strong>
                <span className="text-sm text-gray-500">{new Date(it.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{it.comment}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
