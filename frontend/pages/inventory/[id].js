import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { api } from '../../utils/api'
import { useLocale } from '../../contexts/LocaleContext'
import { Icon } from '../../components/UI'

export default function Detail(){
  const router = useRouter()
  const { id } = router.query
  const { locale } = useLocale()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(()=>{
    if(!id) return
    setLoading(true)
    api.fetchListing(id).then(res=> {
      setItem(res)
      setLoading(false)
    }).catch(err=>{
      console.error('Error fetching listing:', err)
      setLoading(false)
    })
  },[id])

  if(loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner w-8 h-8 mr-3"></div>
          <span className="text-gray-600">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
        </div>
      </main>
    </div>
  )

  if(!item) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4">
        <div className="text-center py-16">
          <div className="text-gray-500 text-lg mb-4">
            {locale === 'ar' ? 'لم يتم العثور على الإعلان' : 'Listing not found'}
          </div>
          <button 
            onClick={() => router.back()}
            className="btn btn-secondary"
          >
            {locale === 'ar' ? 'العودة' : 'Go Back'}
          </button>
        </div>
      </main>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 rounded-full ${isSaved ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-red-200 transition-colors`}
              >
                <Icon icon="heart" className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Icon icon="share" className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Price and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary-600">
                ${item.price.toLocaleString()}
              </span>
              {item.type === 'rental' && item.rentalDetails && (
                <span className="text-sm text-gray-500">
                  {locale === 'ar' ? '$' : '$'}{item.rentalDetails.pricePerDay} {locale === 'ar' ? 'في اليوم' : '/day'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'active' ? 'bg-green-100 text-green-800' : 
                item.status === 'sold' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status === 'active' ? (locale === 'ar' ? 'متاح' : 'Available') : 
                 item.status === 'sold' ? (locale === 'ar' ? 'تم البيع' : 'Sold') : 
                 item.status}
              </span>
              {item.featured && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {locale === 'ar' ? 'مميز' : 'Featured'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <div>
                  {/* Main Image */}
                  <div className="relative">
                    <img 
                      src={
                        (item.images[activeImage]?.url || item.images[activeImage])?.startsWith('http') 
                          ? item.images[activeImage]?.url || item.images[activeImage]
                          : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + (item.images[activeImage]?.url || item.images[activeImage])
                      }
                      className="w-full h-96 object-cover"
                      alt={`${item.title} - ${activeImage + 1}`}
                    />
                    {item.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {activeImage + 1} / {item.images.length}
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {item.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative overflow-hidden rounded border-2 transition-all ${
                          activeImage === i ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={
                            (img.url || img)?.startsWith('http') 
                              ? img.url || img
                              : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + (img.url || img)
                          }
                          className="w-full h-20 object-cover"
                          alt={`${item.title} - ${i + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Icon icon="image" className="w-12 h-12 mx-auto mb-2" />
                    <p>{locale === 'ar' ? 'لا توجد صور' : 'No photos available'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Specifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                {locale === 'ar' ? 'مواصفات المركبة' : 'Vehicle Specifications'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{locale === 'ar' ? 'الصانع' : 'Make'}</span>
                  <span className="font-medium">{item.make}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{locale === 'ar' ? 'الموديل' : 'Model'}</span>
                  <span className="font-medium">{item.model}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{locale === 'ar' ? 'السنة' : 'Year'}</span>
                  <span className="font-medium">{item.year}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{locale === 'ar' ? 'المسافة المقطوعة' : 'Mileage'}</span>
                  <span className="font-medium">{item.mileage?.toLocaleString()} {locale === 'ar' ? 'كم' : 'km'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{locale === 'ar' ? 'نوع الهيكل' : 'Body Type'}</span>
                  <span className="font-medium capitalize">{item.bodyType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{locale === 'ar' ? 'نوع الوقود' : 'Fuel Type'}</span>
                  <span className="font-medium capitalize">{item.fuelType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{locale === 'ar' ? 'ناقل الحركة' : 'Transmission'}</span>
                  <span className="font-medium capitalize">{item.transmission}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{locale === 'ar' ? 'اللون' : 'Color'}</span>
                  <span className="font-medium">{item.color}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{locale === 'ar' ? 'الحالة' : 'Condition'}</span>
                  <span className="font-medium capitalize">{item.condition}</span>
                </div>
                {item.vin && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">VIN</span>
                    <span className="font-medium text-sm">{item.vin}</span>
                  </div>
                )}
              </div>

              {/* Detailed Specifications */}
              {item.specifications && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    {locale === 'ar' ? 'مواصفات مفصلة' : 'Detailed Specifications'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.specifications.engine && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{locale === 'ar' ? 'المحرك' : 'Engine'}</span>
                        <span className="font-medium">{item.specifications.engine}</span>
                      </div>
                    )}
                    {item.specifications.drivetrain && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{locale === 'ar' ? 'نظام الدفع' : 'Drivetrain'}</span>
                        <span className="font-medium">{item.specifications.drivetrain}</span>
                      </div>
                    )}
                    {item.specifications.interior && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{locale === 'ar' ? 'الفرش الداخلي' : 'Interior'}</span>
                        <span className="font-medium">{item.specifications.interior}</span>
                      </div>
                    )}
                    {item.specifications.exterior && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{locale === 'ar' ? 'اللون الخارجي' : 'Exterior'}</span>
                        <span className="font-medium">{item.specifications.exterior}</span>
                      </div>
                    )}
                    {item.specifications.fuelEconomy && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{locale === 'ar' ? 'استهلاك الوقود' : 'Fuel Economy'}</span>
                        <span className="font-medium">
                          {item.specifications.fuelEconomy.city && `${item.specifications.fuelEconomy.city} ${locale === 'ar' ? 'كم/لتر' : 'km/L'} `}
                          {item.specifications.fuelEconomy.highway && `${locale === 'ar' ? 'سريع' : 'hwy'} ${item.specifications.fuelEconomy.highway} ${locale === 'ar' ? 'كم/لتر' : 'km/L'}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            {item.features && item.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {locale === 'ar' ? 'المميزات' : 'Features'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {item.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Icon icon="check" className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                {locale === 'ar' ? 'الوصف' : 'Description'}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            {/* Location */}
            {item.location && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {locale === 'ar' ? 'الموقع' : 'Location'}
                </h2>
                <div className="flex items-start space-x-3">
                  <Icon icon="location" className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-700">
                      {item.location.address && `${item.location.address}, `}
                      {item.location.city}
                      {item.location.state && `, ${item.location.state}`}
                      {item.location.zipCode && ` ${item.location.zipCode}`}
                      {item.location.country && `, ${item.location.country}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions and Seller Info */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                {locale === 'ar' ? 'اتصل بالبائع' : 'Contact Seller'}
              </h2>
              <div className="space-y-3">
                <button className="btn btn-primary w-full">
                  <Icon icon="phone" className="w-4 h-4 mr-2" />
                  {locale === 'ar' ? 'اتصل الآن' : 'Call Now'}
                </button>
                <button className="btn btn-secondary w-full">
                  <Icon icon="mail" className="w-4 h-4 mr-2" />
                  {locale === 'ar' ? 'إرسال رسالة' : 'Send Message'}
                </button>
                {item.type === 'sale' && (
                  <button className="btn btn-outline w-full">
                    <Icon icon="calendar" className="w-4 h-4 mr-2" />
                    {locale === 'ar' ? 'حجز اختبار قيادة' : 'Schedule Test Drive'}
                  </button>
                )}
                {item.type === 'rental' && (
                  <button className="btn btn-outline w-full">
                    <Icon icon="calendar" className="w-4 h-4 mr-2" />
                    {locale === 'ar' ? 'حجز الآن' : 'Book Now'}
                  </button>
                )}
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                {locale === 'ar' ? 'معلومات البائع' : 'Seller Information'}
              </h2>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Icon icon="user" className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">
                    {item.seller?.name || (locale === 'ar' ? 'بائع خاص' : 'Private Seller')}
                  </p>
                  {item.seller?.isVerified && (
                    <div className="flex items-center space-x-1">
                      <Icon icon="check" className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        {locale === 'ar' ? 'موثق' : 'Verified'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {item.dealership && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {locale === 'ar' ? 'الوكالة' : 'Dealership'}
                  </p>
                  <p className="font-medium">{item.dealership.name}</p>
                  {item.dealership.location && (
                    <p className="text-sm text-gray-500 mt-1">{item.dealership.location}</p>
                  )}
                </div>
              )}
            </div>

            {/* History Report */}
            {item.historyReport && item.historyReport.hasReport && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {locale === 'ar' ? 'تقرير التاريخ' : 'History Report'}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{locale === 'ar' ? 'الحوادث' : 'Accidents'}</span>
                    <span className="font-medium">{item.historyReport.accidents || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{locale === 'ar' ? 'المالك السابق' : 'Previous Owners'}</span>
                    <span className="font-medium">{item.historyReport.owners || 1}</span>
                  </div>
                  {item.historyReport.reportUrl && (
                    <button className="btn btn-outline w-full mt-3">
                      {locale === 'ar' ? 'عرض التقرير الكامل' : 'View Full Report'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Listing Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                {locale === 'ar' ? 'تفاصيل الإعلان' : 'Listing Details'}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'ar' ? 'تاريخ النشر' : 'Listed'}</span>
                  <span className="font-medium">
                    {new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'ar' ? 'المشاهدات' : 'Views'}</span>
                  <span className="font-medium">{item.views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'ar' ? 'المحفوظات' : 'Saves'}</span>
                  <span className="font-medium">{item.saves || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'ar' ? 'رقم الإعلان' : 'Listing ID'}</span>
                  <span className="font-medium text-sm">{item._id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
