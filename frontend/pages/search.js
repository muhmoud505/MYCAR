import React, { useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import api from '../utils/api'
import Navbar from '../components/Navbar'

const BODY_TYPES = [
  { key: 'sedan', ar: 'سيدان', en: 'Sedan' },
  { key: 'suv', ar: 'SUV', en: 'SUV' },
  { key: 'coupe', ar: 'كوبيه', en: 'Coupe' },
  { key: 'hatchback', ar: 'هاتشباك', en: 'Hatchback' },
  { key: 'truck', ar: 'شاحنة', en: 'Truck' },
  { key: 'van', ar: 'فان', en: 'Van' },
  { key: 'convertible', ar: 'كابريوليه', en: 'Convertible' },
  { key: 'wagon', ar: 'واجن', en: 'Wagon' }
]
const FUEL_TYPES = [
  { key: 'gasoline', ar: 'بنزين', en: 'Gasoline' },
  { key: 'diesel', ar: 'ديزل', en: 'Diesel' },
  { key: 'electric', ar: 'كهربائي', en: 'Electric' },
  { key: 'hybrid', ar: 'هجين', en: 'Hybrid' },
  { key: 'plug-in-hybrid', ar: 'هجين قابل للشحن', en: 'Plug-in Hybrid' }
]
const TRANSMISSIONS = [
  { key: 'manual', ar: 'يدوي', en: 'Manual' },
  { key: 'automatic', ar: 'أوتوماتيكي', en: 'Automatic' },
  { key: 'cvt', ar: 'CVT', en: 'CVT' }
]
const CONDITIONS = [
  { key: 'new', ar: 'جديد', en: 'New' },
  { key: 'like-new', ar: 'مثل جديد', en: 'Like New' },
  { key: 'excellent', ar: 'ممتاز', en: 'Excellent' },
  { key: 'good', ar: 'جيد', en: 'Good' },
  { key: 'fair', ar: 'مقبول', en: 'Fair' },
  { key: 'poor', ar: 'ضعيف', en: 'Poor' }
]
const LISTING_TYPES = [
  { key: 'sale', ar: 'للبيع', en: 'For Sale' },
  { key: 'rental', ar: 'للإيجار', en: 'For Rental' },
  { key: 'classified', ar: 'مصنف', en: 'Classified' }
]

export default function SearchPage(){
  const { t, locale } = useLocale()
  const [q, setQ] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minYear, setMinYear] = useState('')
  const [maxYear, setMaxYear] = useState('')
  const [minMileage, setMinMileage] = useState('')
  const [maxMileage, setMaxMileage] = useState('')
  const [bodyType, setBodyType] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [transmission, setTransmission] = useState('')
  const [color, setColor] = useState('')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [condition, setCondition] = useState('')
  const [type, setType] = useState('')
  const [featured, setFeatured] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

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
      if (minMileage) qs.set('minMileage', minMileage)
      if (maxMileage) qs.set('maxMileage', maxMileage)
      if (bodyType) qs.set('bodyType', bodyType)
      if (fuelType) qs.set('fuelType', fuelType)
      if (transmission) qs.set('transmission', transmission)
      if (color) qs.set('color', color)
      if (location) qs.set('location', location)
      if (city) qs.set('city', city)
      if (state) qs.set('state', state)
      if (condition) qs.set('condition', condition)
      if (type) qs.set('type', type)
      if (featured) qs.set('featured', 'true')
      if (sortBy) qs.set('sortBy', sortBy)
      if (sortOrder) qs.set('sortOrder', sortOrder)
      
      const res = await api.search(qs.toString())
      if (res && res.results) setResults(res.results)
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  const clearFilters = () => {
    setQ('')
    setMake('')
    setModel('')
    setMinPrice('')
    setMaxPrice('')
    setMinYear('')
    setMaxYear('')
    setMinMileage('')
    setMaxMileage('')
    setBodyType('')
    setFuelType('')
    setTransmission('')
    setColor('')
    setLocation('')
    setCity('')
    setState('')
    setCondition('')
    setType('')
    setFeatured(false)
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">
              Find Your Perfect Car
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Search through thousands of vehicles with advanced filters
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Basic Search */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
              placeholder={t('pages.searchPlaceholder')} 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
            />
            <input className="p-3 border rounded-lg" placeholder={t('pages.filterMake')} value={make} onChange={e=>setMake(e.target.value)} />
            <input className="p-3 border rounded-lg" placeholder={t('pages.filterModel')} value={model} onChange={e=>setModel(e.target.value)} />
            <input className="p-3 border rounded-lg" placeholder={t('pages.filterLocation')} value={location} onChange={e=>setLocation(e.target.value)} />
          </div>
          
          <div className="mt-4 flex gap-4">
            <button onClick={runSearch} className="btn btn-primary px-6 py-2">
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              className="btn btn-secondary px-6 py-2"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
            </button>
            <button onClick={clearFilters} className="btn btn-outline px-6 py-2">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-1">Min Price</label>
                <input className="p-2 border rounded w-full" placeholder="0" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Price</label>
                <input className="p-2 border rounded w-full" placeholder="100000" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
              </div>
              
              {/* Year Range */}
              <div>
                <label className="block text-sm font-medium mb-1">Min Year</label>
                <input className="p-2 border rounded w-full" placeholder="2000" value={minYear} onChange={e=>setMinYear(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Year</label>
                <input className="p-2 border rounded w-full" placeholder="2024" value={maxYear} onChange={e=>setMaxYear(e.target.value)} />
              </div>
              
              {/* Mileage Range */}
              <div>
                <label className="block text-sm font-medium mb-1">Min Mileage</label>
                <input className="p-2 border rounded w-full" placeholder="0" value={minMileage} onChange={e=>setMinMileage(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Mileage</label>
                <input className="p-2 border rounded w-full" placeholder="200000" value={maxMileage} onChange={e=>setMaxMileage(e.target.value)} />
              </div>
              
              {/* Dropdown Filters */}
              <div>
                <label className="block text-sm font-medium mb-1">{locale === 'ar' ? 'نوع الهيكل' : 'Body Type'}</label>
                <select className="p-2 border rounded w-full" value={bodyType} onChange={e=>setBodyType(e.target.value)}>
                  <option value="">{locale === 'ar' ? 'الكل' : 'Any'}</option>
                  {BODY_TYPES.map(type => (
                    <option key={type.key} value={type.key}>{locale === 'ar' ? type.ar : type.en}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{locale === 'ar' ? 'نوع الوقود' : 'Fuel Type'}</label>
                <select className="p-2 border rounded w-full" value={fuelType} onChange={e=>setFuelType(e.target.value)}>
                  <option value="">{locale === 'ar' ? 'الكل' : 'Any'}</option>
                  {FUEL_TYPES.map(type => (
                    <option key={type.key} value={type.key}>{locale === 'ar' ? type.ar : type.en}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{locale === 'ar' ? 'ناقل الحركة' : 'Transmission'}</label>
                <select className="p-2 border rounded w-full" value={transmission} onChange={e=>setTransmission(e.target.value)}>
                  <option value="">{locale === 'ar' ? 'الكل' : 'Any'}</option>
                  {TRANSMISSIONS.map(type => (
                    <option key={type.key} value={type.key}>{locale === 'ar' ? type.ar : type.en}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{locale === 'ar' ? 'الحالة' : 'Condition'}</label>
                <select className="p-2 border rounded w-full" value={condition} onChange={e=>setCondition(e.target.value)}>
                  <option value="">{locale === 'ar' ? 'الكل' : 'Any'}</option>
                  {CONDITIONS.map(cond => (
                    <option key={cond.key} value={cond.key}>{locale === 'ar' ? cond.ar : cond.en}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">{locale === 'ar' ? 'نوع الإعلان' : 'Listing Type'}</label>
                <select className="p-2 border rounded w-full" value={type} onChange={e=>setType(e.target.value)}>
                  <option value="">{locale === 'ar' ? 'الكل' : 'Any'}</option>
                  {LISTING_TYPES.map(listType => (
                    <option key={listType.key} value={listType.key}>{locale === 'ar' ? listType.ar : listType.en}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input className="p-2 border rounded w-full" placeholder="e.g., Black" value={color} onChange={e=>setColor(e.target.value)} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input className="p-2 border rounded w-full" placeholder="e.g., New York" value={city} onChange={e=>setCity(e.target.value)} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input className="p-2 border rounded w-full" placeholder="e.g., NY" value={state} onChange={e=>setState(e.target.value)} />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="featured" 
                  checked={featured} 
                  onChange={e=>setFeatured(e.target.checked)} 
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm font-medium">Featured Only</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Sort By</label>
                <select className="p-2 border rounded w-full" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                  <option value="createdAt">Date Listed</option>
                  <option value="price">Price</option>
                  <option value="year">Year</option>
                  <option value="mileage">Mileage</option>
                  <option value="views">Views</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <select className="p-2 border rounded w-full" value={sortOrder} onChange={e=>setSortOrder(e.target.value)}>
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Results ({results.length})</h2>
          </div>
          
          <div className="space-y-4">
            {results.length === 0 && <p className="text-gray-600 text-center py-8">No results found.</p>}
            {results.map(r => (
              <div key={r._id} className="p-4 bg-white border rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{r.title}</h3>
                      {r.featured && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Featured</span>}
                      {r.seller?.isVerified && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>}
                    </div>
                    <p className="text-gray-600 mb-2">{r.make} {r.model} • {r.year} • {r.mileage?.toLocaleString()} miles</p>
                    <p className="text-sm text-gray-500 mb-2">{r.location?.city}, {r.location?.state}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{r.bodyType}</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{r.fuelType}</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{r.transmission}</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{r.condition}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${r.price?.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{r.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
