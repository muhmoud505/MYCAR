import { useState } from 'react'

export default function FilterPanel({ onApply, initial = {} }){
  const [title, setTitle] = useState(initial.title || '')
  const [make, setMake] = useState(initial.make || '')
  const [model, setModel] = useState(initial.model || '')
  const [minPrice, setMinPrice] = useState(initial.minPrice || '')
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice || '')
  const [minYear, setMinYear] = useState(initial.minYear || '')
  const [maxYear, setMaxYear] = useState(initial.maxYear || '')
  const [minMileage, setMinMileage] = useState(initial.minMileage || '')
  const [maxMileage, setMaxMileage] = useState(initial.maxMileage || '')
  const [bodyType, setBodyType] = useState(initial.bodyType || '')
  const [fuelType, setFuelType] = useState(initial.fuelType || '')
  const [transmission, setTransmission] = useState(initial.transmission || '')
  const [color, setColor] = useState(initial.color || '')
  const [location, setLocation] = useState(initial.location || '')

  function apply(){
    const q = {}
    if (title) q.title = title
    if (make) q.make = make
    if (model) q.model = model
    if (minPrice) q.minPrice = minPrice
    if (maxPrice) q.maxPrice = maxPrice
    if (minYear) q.minYear = minYear
    if (maxYear) q.maxYear = maxYear
    if (minMileage) q.minMileage = minMileage
    if (maxMileage) q.maxMileage = maxMileage
    if (bodyType) q.bodyType = bodyType
    if (fuelType) q.fuelType = fuelType
    if (transmission) q.transmission = transmission
    if (color) q.color = color
    if (location) q.location = location
    onApply(q)
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="grid gap-2 md:grid-cols-3">
        <input placeholder="Search title" value={title} onChange={e=>setTitle(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Make" value={make} onChange={e=>setMake(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Model" value={model} onChange={e=>setModel(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Min price" value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Max price" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Min year" value={minYear} onChange={e=>setMinYear(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Max year" value={maxYear} onChange={e=>setMaxYear(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Min mileage" value={minMileage} onChange={e=>setMinMileage(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Max mileage" value={maxMileage} onChange={e=>setMaxMileage(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Body type" value={bodyType} onChange={e=>setBodyType(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Fuel type" value={fuelType} onChange={e=>setFuelType(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Transmission" value={transmission} onChange={e=>setTransmission(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Color" value={color} onChange={e=>setColor(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Location / ZIP" value={location} onChange={e=>setLocation(e.target.value)} className="p-2 border rounded" />
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={apply} className="px-4 py-2 bg-blue-600 text-white rounded">Apply</button>
        <button type="button" onClick={()=>{ window.location.reload() }} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
      </div>
    </div>
  )
}
