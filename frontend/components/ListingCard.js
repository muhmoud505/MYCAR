import Link from 'next/link'
import { useLocale } from '../contexts/LocaleContext'

export default function ListingCard({ listing }){
  const { t } = useLocale()
  const id = listing._id || listing.id
  const img = listing.images && listing.images.length ? (listing.images[0].startsWith('http') ? listing.images[0] : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + listing.images[0]) : null
  const thumb = listing.images && listing.images.length ? (() => {
    const p = listing.images[0]
    if (p.startsWith('http')) return p
    const filename = p.split('/').pop()
    return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/uploads/thumbs/thumb-' + filename
  })() : null
  return (
    <Link href={`/inventory/${id}`} className="block card hover:shadow-lg overflow-hidden">
      <div className="relative">
        {thumb ? (
          <img src={thumb} alt={listing.title} className="h-44 w-full object-cover" />
        ) : img ? (
          <img src={img} alt={listing.title} className="h-44 w-full object-cover" />
        ) : (
          <div className="h-44 bg-gray-200 flex items-center justify-center text-gray-500">{t('site.image')}</div>
        )}
        <div className="absolute top-3 right-3 bg-white/80 text-sm px-2 py-1 rounded-md font-semibold">${listing.price}</div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-lg">{listing.title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{listing.description}</p>
        <div className="mt-3 text-xs text-gray-500">{listing.make} • {listing.model} • {listing.year}</div>
      </div>
    </Link>
  )
}
