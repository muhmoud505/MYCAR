import React, { useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import api from '../utils/api'
import Navbar from '../components/Navbar'

export default function SearchPage(){
  const { t } = useLocale()
  const [q, setQ] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minYear, setMinYear] = useState('')
  const [maxYear, setMaxYear] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const runSearch = async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (q) qs.set('q', q)
      if (make) qs.set('make', make)
      if (model) qs.set('model', model)
      if (minPrice) qs.set('minPrice', minPrice)
      if (maxPrice) qs.set('maxPrice', maxPrice)
      if (minYear) qs.set('minYear', minYear)
      if (maxYear) qs.set('maxYear', maxYear)
      const res = await api.search(qs.toString())
      if (res && res.results) setResults(res.results)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">{t('pages.search')}</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="p-2 border rounded" placeholder={t('pages.searchPlaceholder')} value={q} onChange={e=>setQ(e.target.value)} />
          <input className="p-2 border rounded" placeholder={t('pages.filterMake')} value={make} onChange={e=>setMake(e.target.value)} />
          <input className="p-2 border rounded" placeholder={t('pages.filterModel')} value={model} onChange={e=>setModel(e.target.value)} />
          <input className="p-2 border rounded" placeholder={t('pages.filterMinPrice')} value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
          <input className="p-2 border rounded" placeholder={t('pages.filterMaxPrice')} value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
          <input className="p-2 border rounded" placeholder={t('pages.filterMinYear')} value={minYear} onChange={e=>setMinYear(e.target.value)} />
          <input className="p-2 border rounded" placeholder={t('pages.filterMaxYear')} value={maxYear} onChange={e=>setMaxYear(e.target.value)} />
        </div>
        <div className="mt-4">
          <button onClick={runSearch} className="btn btn-primary">{loading ? 'Searching...' : 'Search'}</button>
        </div>

        <div className="mt-6 space-y-4">
          {results.length === 0 && <p className="text-gray-600">No results.</p>}
          {results.map(r => (
            <div key={r._id} className="p-4 bg-white border rounded">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{r.title}</h3>
                <div className="text-sm text-gray-600">{r.price ? `$${r.price}` : ''}</div>
              </div>
              <p className="text-sm text-gray-600">{r.make} {r.model} • {r.year}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
