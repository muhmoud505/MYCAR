import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { useLocale } from '../../contexts/LocaleContext'
import ListingCard from '../../components/ListingCard'
import FilterPanel from '../../components/FilterPanel'
import { api } from '../../utils/api'

export default function Inventory(){
  const { t } = useLocale()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchWithFilters(filters){
    setLoading(true)
    const params = new URLSearchParams()
    for (const k in filters) if (filters[k]) params.set(k, filters[k])
    try{
      const res = await api.fetchListings(params.toString())
      setItems(res.items || [])
    }catch(e){ }
    setLoading(false)
  }

  useEffect(()=>{
    let mounted = true
    api.fetchListings().then(res=>{
      if(mounted) setItems(res.items || [])
    }).catch(()=>{}).finally(()=> setLoading(false))
    return ()=> mounted = false
  },[])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t('site.inventory')}</h1>
        <FilterPanel onApply={fetchWithFilters} />
        {loading ? <div>{t('form.loading')}</div> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map(it=> <ListingCard key={it._id || it.id} listing={it} />)}
          </div>
        )}
      </main>
    </div>
  )
}
