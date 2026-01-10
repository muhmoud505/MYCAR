import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { api } from '../../utils/api'

export default function Detail(){
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState(null)

  useEffect(()=>{
    if(!id) return
    api.fetchListing(id).then(res=> setItem(res)).catch(()=>{})
  },[id])

  if(!item) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">Loading...</main>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
        <div className="bg-white p-4 rounded shadow">
          {item.images && item.images.length ? (
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 mb-4">
              {item.images.map((src, i) => {
                const url = src.startsWith('http') ? src : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + src
                return <img key={i} src={url} className="w-full h-44 object-cover rounded" alt={`img-${i}`} />
              })}
            </div>
          ) : (
            <div className="h-64 bg-gray-200 mb-4 flex items-center justify-center text-gray-500">No photos</div>
          )}
          <p className="text-gray-700 mb-2">{item.description}</p>
          <div className="font-bold text-xl">${item.price}</div>
        </div>
      </main>
    </div>
  )
}
