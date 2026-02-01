import { useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import ErrorAlert from '../../components/ErrorAlert'
import { Icon } from '../../components/UI'
import { api } from '../../utils/api'
import { parseApiError, validateRequired } from '../../utils/errorHandling'

export default function CreateListing(){
  const { t, locale } = useLocale()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [files, setFiles] = useState([])
  const [make, setMake] = useState('')
  const [modelField, setModelField] = useState('')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [bodyType, setBodyType] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [transmission, setTransmission] = useState('')
  const [color, setColor] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    
    // Client-side validation
    try {
      validateRequired(title, locale === 'ar' ? 'العنوان' : 'Title', locale)
      validateRequired(description, locale === 'ar' ? 'الوصف' : 'Description', locale)
      validateRequired(price, locale === 'ar' ? 'السعر' : 'Price', locale)
      validateRequired(make, locale === 'ar' ? 'الصانع' : 'Make', locale)
      validateRequired(modelField, locale === 'ar' ? 'الموديل' : 'Model', locale)
      validateRequired(year, locale === 'ar' ? 'السنة' : 'Year', locale)
      validateRequired(mileage, locale === 'ar' ? 'المسافة المقطوعة' : 'Mileage', locale)
      validateRequired(bodyType, locale === 'ar' ? 'نوع الهيكل' : 'Body Type', locale)
      validateRequired(fuelType, locale === 'ar' ? 'نوع الوقود' : 'Fuel Type', locale)
      validateRequired(transmission, locale === 'ar' ? 'ناقل الحركة' : 'Transmission', locale)
      validateRequired(color, locale === 'ar' ? 'اللون' : 'Color', locale)
      validateRequired(city, locale === 'ar' ? 'المدينة' : 'City', locale)
      
      if (isNaN(price) || parseFloat(price) <= 0) {
        throw new Error(locale === 'ar' ? 'يجب أن يكون السعر رقماً موجباً صالحاً' : 'Price must be a valid positive number')
      }
      
      if (isNaN(year) || parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear() + 1) {
        throw new Error(locale === 'ar' ? 'يرجى إدخال سنة صالحة' : 'Please enter a valid year')
      }
      
      if (isNaN(mileage) || parseFloat(mileage) < 0) {
        throw new Error(locale === 'ar' ? 'يجب أن تكون المسافة المقطوعة رقماً صالحاً' : 'Mileage must be a valid number')
      }
    } catch (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try{
      const listing = await api.createListing({
        title, description, price: Number(price),
        make, model: modelField, year, mileage,
        bodyType, fuelType, transmission, color,
        location: {
          city,
          state: state || ''
        }
      })
      const id = listing._id || listing.id
      
      // upload images if present
      if (files && files.length) {
        const form = new FormData()
        for (const f of files) form.append('images', f)
        const token = localStorage.getItem('token')
        const uploadResponse = await fetch(`/api/listings/${id}/images`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form
        })
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images')
        }
      }
      
      router.push('/inventory')
    } catch (err) {
      console.error('Listing creation error:', err)
      setError(parseApiError(err, locale))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{t('form.createListing')}</h1>
        
        <ErrorAlert 
          error={error} 
          onDismiss={() => setError(null)} 
        />
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('form.title')} *
              </label>
              <input 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 2022 Toyota Camry SE"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('form.description')} *
              </label>
              <textarea 
                value={description} 
                onChange={e=>setDescription(e.target.value)} 
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 resize-y"
                rows={4}
                placeholder="Describe your vehicle's condition, features, and history..."
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('form.price')} ($) *
              </label>
              <input 
                type="number"
                value={price} 
                onChange={e=>setPrice(e.target.value)} 
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="25000"
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.images')}
            </label>
            <input 
              type="file" 
              multiple 
              onChange={e=>setFiles(Array.from(e.target.files))} 
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              accept="image/*"
              disabled={loading}
            />
            {files.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              {locale === 'ar' ? 'تفاصيل المركبة' : 'Vehicle Details'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.make')} *
                </label>
                <input 
                  value={make} 
                  onChange={e=>setMake(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder={locale === 'ar' ? 'تويوتا' : 'Toyota'}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.model')} *
                </label>
                <input 
                  value={modelField} 
                  onChange={e=>setModelField(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder={locale === 'ar' ? 'كامري' : 'Camry'}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.year')} *
                </label>
                <input 
                  type="number"
                  value={year} 
                  onChange={e=>setYear(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder={locale === 'ar' ? '2022' : '2022'}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.mileage')} *
                </label>
                <input 
                  type="number"
                  value={mileage} 
                  onChange={e=>setMileage(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder={locale === 'ar' ? '25000' : '25000'}
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.bodyType')} *
                </label>
                <select
                  value={bodyType} 
                  onChange={e=>setBodyType(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  disabled={loading}
                >
                  <option value="">Select body type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="coupe">Coupe</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="convertible">Convertible</option>
                  <option value="wagon">Wagon</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.fuelType')} *
                </label>
                <select
                  value={fuelType} 
                  onChange={e=>setFuelType(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  disabled={loading}
                >
                  <option value="">Select fuel type</option>
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="plug-in-hybrid">Plug-in Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.transmission')} *
                </label>
                <select
                  value={transmission} 
                  onChange={e=>setTransmission(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  disabled={loading}
                >
                  <option value="">Select transmission</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.color')} *
                </label>
                <input 
                  value={color} 
                  onChange={e=>setColor(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Silver"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Location</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.city')} *
                </label>
                <input 
                  value={city} 
                  onChange={e=>setCity(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="New York"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.state')}
                </label>
                <input 
                  value={state} 
                  onChange={e=>setState(e.target.value)} 
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="NY"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg font-medium"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Listing...
              </>
            ) : (
              <>
                <Icon icon="plus" className="w-5 h-5 mr-2" />
                {t('form.create')}
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
