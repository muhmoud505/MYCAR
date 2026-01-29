import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import { useAuth } from '../contexts/AuthContext'
import { Icon } from './UI'

export default function Navbar(){
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading, logout, isAuthenticated } = useAuth()
  const { locale, setLocale, t } = useLocale()

  return (
    <header className={`bg-white shadow-soft border-b border-secondary-100 sticky top-0 z-40 ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gradient">{t('site.title')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/search">
              <span className="nav-link">{t('site.search')}</span>
            </Link>
            <Link href="/inventory">
              <span className="nav-link">{t('site.inventory')}</span>
            </Link>
            <Link href="/classifieds">
              <span className="nav-link">{t('site.classifieds')}</span>
            </Link>
            <Link href="/rentals">
              <span className="nav-link">{t('site.rentals')}</span>
            </Link>
            <Link href="/reviews">
              <span className="nav-link">{t('site.reviews')}</span>
            </Link>
            <Link href="/dealerships">
              <span className="nav-link">{t('site.dealerships')}</span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Selector */}
            <select 
              value={locale} 
              onChange={(e)=>setLocale(e.target.value)} 
              className="text-sm border border-secondary-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>

            {/* Authenticated User */}
            {isAuthenticated && !loading && (
              <div className="flex items-center space-x-3">
                <Link href="/messages">
                  <span className="nav-link relative">
                    {t('site.messages')}
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-error-500 rounded-full"></span>
                  </span>
                </Link>
                <Link href="/listings/create">
                  <span className="btn btn-primary btn-sm">{t('site.sell')}</span>
                </Link>
                
                {/* Admin Dashboard Link */}
                {user?.role === 'admin' && (
                  <Link href="/admin/dashboard-simple">
                    <span className="btn btn-error btn-sm">
                      <Icon icon="settings" className="w-4 h-4 mr-2" />
                      {t('site.admin')}
                    </span>
                  </Link>
                )}
                
                {/* Account Management */}
                <Link href="/account">
                  <span className="btn btn-outline btn-sm">
                    <Icon icon="user" className="w-4 h-4 mr-2" />
                    {t('site.account')}
                  </span>
                </Link>
                
                <button 
                  onClick={logout} 
                  className="btn btn-outline btn-sm"
                >
                  {t('site.signOut')}
                </button>
              </div>
            )}

            {/* Unauthenticated User */}
            {!isAuthenticated && !loading && (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <span className="btn btn-outline btn-sm">{t('site.signIn')}</span>
                </Link>
                <Link href="/auth/register">
                  <span className="btn btn-primary btn-sm">{t('site.signUp')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100"
          >
            <Icon icon="menu" className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-secondary-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/search" className="nav-link-mobile">
                {t('site.search')}
              </Link>
              <Link href="/inventory" className="nav-link-mobile">
                {t('site.inventory')}
              </Link>
              <Link href="/classifieds" className="nav-link-mobile">
                {t('site.classifieds')}
              </Link>
              <Link href="/rentals" className="nav-link-mobile">
                {t('site.rentals')}
              </Link>
              <Link href="/reviews" className="nav-link-mobile">
                {t('site.reviews')}
              </Link>
              <Link href="/dealerships" className="nav-link-mobile">
                {t('site.dealerships')}
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-secondary-200 mt-4">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link href="/messages" className="nav-link-mobile">
                      {t('site.messages')}
                    </Link>
                    <Link href="/listings/create" className="nav-link-mobile">
                      {t('site.sell')}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/admin/dashboard-simple" className="nav-link-mobile">
                        {t('site.admin')}
                      </Link>
                    )}
                    <Link href="/account" className="nav-link-mobile">
                      {t('site.account')}
                    </Link>
                    <button 
                      onClick={logout} 
                      className="nav-link-mobile text-left"
                    >
                      {t('site.signOut')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth/login" className="nav-link-mobile">
                      {t('site.signIn')}
                    </Link>
                    <Link href="/auth/register" className="nav-link-mobile">
                      {t('site.signUp')}
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
