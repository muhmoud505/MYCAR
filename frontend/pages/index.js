import Link from 'next/link'
import Navbar from '../components/Navbar'
import { useLocale } from '../contexts/LocaleContext'

export default function Home() {
  const { t } = useLocale()
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <section className="bg-white rounded-lg shadow p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{t('site.findYourNextCar')}</h1>
            <p className="text-gray-600 mb-4">{t('site.findYourNextCar')}</p>
            <div className="flex gap-2">
              <Link href="/inventory" className="btn">{t('site.browseInventory')}</Link>
              <Link href="/listings/create" className="ml-2 text-sm text-gray-700">{t('site.sellVehicle')}</Link>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 rounded p-3">
              <input placeholder="Search make, model, or location" className="w-full p-2 rounded border" />
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Link href="/inventory" className="p-6 bg-white rounded shadow hover:shadow-lg">{t('site.inventory')}</Link>
          <Link href="/classifieds" className="p-6 bg-white rounded shadow hover:shadow-lg">{t('site.classifieds')}</Link>
          <Link href="/rentals" className="p-6 bg-white rounded shadow hover:shadow-lg">{t('site.rentals')}</Link>
          <Link href="/reviews" className="p-6 bg-white rounded shadow hover:shadow-lg">{t('site.reviews')}</Link>
        </div>
      </main>
    </div>
  )
}
