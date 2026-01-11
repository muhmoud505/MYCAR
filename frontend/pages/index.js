import Link from 'next/link'
import Navbar from '../components/Navbar'
import { Icon } from '../components/UI'
import { useLocale } from '../contexts/LocaleContext'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { t } = useLocale()
  const { isAuthenticated, loading } = useAuth()
  
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Find Your Perfect Car
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Search thousands of vehicles, connect with sellers, and drive away in your dream car
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <Link href="/search" className="btn btn-white btn-lg text-primary-600 hover:bg-primary-50">
                <Icon icon="search" className="w-5 h-5 mr-2" />
                Search Cars
              </Link>
              {isAuthenticated && !loading ? (
                <Link href="/listings/create" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
                  Sell Your Car
                </Link>
              ) : (
                <Link href="/auth/register" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
                  Create Account to Sell
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input 
                  placeholder="Search make, model, or location..." 
                  className="input text-lg py-3"
                />
              </div>
              <button className="btn btn-primary btn-lg">
                <Icon icon="search" className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Explore Our Services</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Everything you need to buy, sell, or rent vehicles in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/inventory" className="card card-hover group">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon icon="search" className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">{t('site.inventory')}</h3>
                <p className="text-secondary-600">Browse our extensive inventory of quality vehicles</p>
              </div>
            </Link>
            
            <Link href="/classifieds" className="card card-hover group">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon icon="star" className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">{t('site.classifieds')}</h3>
                <p className="text-secondary-600">Post and browse classified ads from private sellers</p>
              </div>
            </Link>
            
            <Link href="/rentals" className="card card-hover group">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon icon="calendar" className="w-8 h-8 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">{t('site.rentals')}</h3>
                <p className="text-secondary-600">Rent vehicles for short or long term needs</p>
              </div>
            </Link>
            
            <Link href="/reviews" className="card card-hover group">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon icon="star" className="w-8 h-8 text-warning-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">{t('site.reviews')}</h3>
                <p className="text-secondary-600">Read expert and user reviews on vehicles</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-secondary-600">Active Listings</div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl font-bold text-accent-600 mb-2">5,000+</div>
              <div className="text-secondary-600">Happy Customers</div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-bold text-success-600 mb-2">500+</div>
              <div className="text-secondary-600">Verified Dealers</div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="text-4xl font-bold text-warning-600 mb-2">4.8/5</div>
              <div className="text-secondary-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers who found their perfect vehicle with MYCAR
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="btn btn-white btn-lg text-primary-600 hover:bg-primary-50">
              Start Searching
            </Link>
            <Link href="/auth/register" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
