import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useLocale } from '../contexts/LocaleContext'
import { Icon } from '../components/UI'

export default function ContactPage(){
  const { locale } = useLocale()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.ok) {
        setMessage(locale === 'ar' ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Your message has been sent successfully! We will contact you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        setError(data.error || (locale === 'ar' ? 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.' : 'Failed to send message. Please try again.'))
      }
    } catch (err) {
      console.error('Contact form error:', err)
      setError(locale === 'ar' ? 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.' : 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'نحن هنا لمساعدتك. أرسل لنا رسالة وسنتواصل معك في أقرب وقت ممكن.'
              : 'We are here to help. Send us a message and we will get back to you as soon as possible.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {locale === 'ar' ? 'أرسل رسالة' : 'Send us a message'}
            </h2>

            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <Icon icon="check" className="w-5 h-5 text-green-400 mr-2" />
                  <p className="text-sm text-green-800">{message}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <Icon icon="alert" className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input w-full"
                    placeholder={locale === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input w-full"
                    placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder={locale === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ar' ? 'الموضوع' : 'Subject'} *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input w-full"
                  placeholder={locale === 'ar' ? 'أدخل موضوع رسالتك' : 'Enter your message subject'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'ar' ? 'الرسالة' : 'Message'} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input w-full"
                  placeholder={locale === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    {locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Icon icon="mail" className="w-4 h-4 mr-2" />
                    {locale === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {locale === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon icon="mail" className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </h3>
                    <p className="text-gray-600">support@mycar.com</p>
                    <p className="text-gray-600">info@mycar.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon icon="phone" className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {locale === 'ar' ? 'الهاتف' : 'Phone'}
                    </h3>
                    <p className="text-gray-600">+1-800-123-4567</p>
                    <p className="text-gray-600 text-sm">
                      {locale === 'ar' ? 'السبت - الخميس: 9 صباحاً - 6 مساءً' : 'Mon-Thu: 9AM - 6PM'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon icon="location" className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {locale === 'ar' ? 'العنوان' : 'Address'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'ar' 
                        ? '123 شارع السيارات، المدينة، الدولة 12345'
                        : '123 Car Street, City, State 12345'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {locale === 'ar' ? 'ساعات العمل' : 'Business Hours'}
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'ar' ? 'السبت - الخميس' : 'Monday - Thursday'}
                  </span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'ar' ? 'الجمعة' : 'Friday'}
                  </span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'ar' ? 'السبت' : 'Saturday'}
                  </span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'ar' ? 'الأحد' : 'Sunday'}
                  </span>
                  <span className="font-medium">
                    {locale === 'ar' ? 'مغلق' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {locale === 'ar' ? 'تابعنا على' : 'Follow Us'}
              </h2>
              
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                  <Icon icon="facebook" className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                  <Icon icon="twitter" className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                  <Icon icon="instagram" className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                  <Icon icon="linkedin" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
