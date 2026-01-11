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
    <header className="bg-white shadow-soft border-b border-secondary-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gradient">MYCAR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/search">
              <span className="nav-link">Search</span>
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
              <span className="nav-link">Dealerships</span>
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
                    Messages
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
                      Admin
                    </span>
                  </Link>
                )}
                
                {/* Account Management */}
                <Link href="/account">
                  <span className="btn btn-outline btn-sm">
                    <Icon icon="user" className="w-4 h-4 mr-2" />
                    My Account
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
                  <span className="nav-link">{t('site.signIn')}</span>
                </Link>
                <Link href="/auth/register">
                  <span className="btn btn-primary btn-sm">{t('site.signUp')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-ghost btn-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-secondary-100 py-4 animate-fade-in-down">
            <nav className="flex flex-col space-y-2">
              <Link href="/search">
                <span className="nav-link block">Search</span>
              </Link>
              <Link href="/inventory">
                <span className="nav-link block">{t('site.inventory')}</span>
              </Link>
              <Link href="/classifieds">
                <span className="nav-link block">{t('site.classifieds')}</span>
              </Link>
              <Link href="/rentals">
                <span className="nav-link block">{t('site.rentals')}</span>
              </Link>
              <Link href="/reviews">
                <span className="nav-link block">{t('site.reviews')}</span>
              </Link>
              <Link href="/dealerships">
                <span className="nav-link block">Dealerships</span>
              </Link>
              
              {isAuthenticated && !loading && (
                <>
                  <Link href="/messages">
                    <span className="nav-link block">Messages</span>
                  </Link>
                  <Link href="/listings/create">
                    <span className="nav-link block">{t('site.sell')}</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin/dashboard-simple">
                      <span className="nav-link block text-error-600 font-medium">
                        <Icon icon="settings" className="w-4 h-4 mr-2 inline" />
                        Admin Dashboard
                      </span>
                    </Link>
                  )}
                  <Link href="/account">
                    <span className="nav-link block">
                      <Icon icon="user" className="w-4 h-4 mr-2 inline" />
                      My Account
                    </span>
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100">
              <select 
                value={locale} 
                onChange={(e)=>setLocale(e.target.value)} 
                className="text-sm border border-secondary-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>

              {isAuthenticated && !loading ? (
                <button 
                  onClick={logout} 
                  className="btn btn-outline btn-sm"
                >
                  {t('site.signOut')}
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <span className="nav-link">{t('site.signIn')}</span>
                  </Link>
                  <Link href="/auth/register">
                    <span className="btn btn-primary btn-sm">{t('site.signUp')}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
