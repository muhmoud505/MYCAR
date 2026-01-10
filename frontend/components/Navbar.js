import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'

export default function Navbar(){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    try{
      const token = localStorage.getItem('token')
      setUser(token ? { authenticated: true } : null)
    }catch(e){ setUser(null) }
  },[])

  const { locale, setLocale, t } = useLocale()

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-extrabold text-primary">{t('site.title')}</span>
        </Link>
        <nav className="space-x-4 hidden sm:flex items-center">
          <Link href="/inventory"><span className="text-sm text-gray-700 hover:text-primary">{t('site.inventory')}</span></Link>
          <Link href="/classifieds"><span className="text-sm text-gray-700 hover:text-primary">{t('site.classifieds')}</span></Link>
          <Link href="/rentals"><span className="text-sm text-gray-700 hover:text-primary">{t('site.rentals')}</span></Link>
          <Link href="/reviews"><span className="text-sm text-gray-700 hover:text-primary">{t('site.reviews')}</span></Link>
        </nav>
        <div className="space-x-3 flex items-center">
          <select value={locale} onChange={(e)=>setLocale(e.target.value)} className="text-sm border rounded px-2 py-1">
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>
          {!user && (
            <>
              <Link href="/auth/login"><span className="text-sm text-gray-700">{t('site.signIn')}</span></Link>
              <Link href="/auth/register"><span className="ml-2 btn">{t('site.signUp')}</span></Link>
            </>
          )}
          {user && (
            <>
              <Link href="/listings/create"><span className="text-sm text-gray-700">{t('site.sell')}</span></Link>
              <button onClick={()=>{ localStorage.removeItem('token'); location.reload() }} className="ml-2 btn">{t('site.signOut')}</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
