import { useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { api } from '../../utils/api'

export default function CreateListing(){
  const { t } = useLocale()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      const listing = await api.createListing({
        title, description, price: Number(price),
        make, model: modelField, year, mileage,
        bodyType, fuelType, transmission, color, location
      })
      const id = listing._id || listing.id
      // upload images if present
      if (files && files.length) {
        const form = new FormData()
        for (const f of files) form.append('images', f)
        const token = localStorage.getItem('token')
        await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + `/api/listings/${id}/images`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form
        })
      }
      router.push('/inventory')
    }catch(err){
      setError(err.message || 'Failed')
    }
  }

  const [files, setFiles] = useState([])
  const [make, setMake] = useState('')
  const [modelField, setModelField] = useState('')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [bodyType, setBodyType] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [transmission, setTransmission] = useState('')
  const [color, setColor] = useState('')
  const [location, setLocation] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{t('form.createListing')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm">{t('form.title')}</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
            <div>
              <label className="block text-sm">{t('form.images')}</label>
              <input type="file" multiple onChange={e=>setFiles(Array.from(e.target.files))} className="w-full mt-1 p-2" />
            </div>
          <div>
            <label className="block text-sm">{t('form.description')}</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-sm">{t('form.make')}</label>
              <input value={make} onChange={e=>setMake(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm">{t('form.model')}</label>
              <input value={modelField} onChange={e=>setModelField(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm">{t('form.year')}</label>
              <input value={year} onChange={e=>setYear(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm">{t('form.mileage')}</label>
              <input value={mileage} onChange={e=>setMileage(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>
          <div>
              <label className="block text-sm">{t('form.price')}</label>
            <input value={price} onChange={e=>setPrice(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-sm">{t('form.bodyType')}</label>
              <input value={bodyType} onChange={e=>setBodyType(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm">{t('form.fuelType')}</label>
              <input value={fuelType} onChange={e=>setFuelType(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm">{t('form.transmission')}</label>
              <input value={transmission} onChange={e=>setTransmission(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm">{t('form.color')}</label>
              <input value={color} onChange={e=>setColor(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>
          <div>
              <label className="block text-sm">{t('form.location')}</label>
              <input value={location} onChange={e=>setLocation(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
          {error && <div className="text-red-600">{error}</div>}
            <button className="w-full py-2 bg-indigo-600 text-white rounded">{t('form.create')}</button>
        </form>
      </main>
    </div>
  )
}
