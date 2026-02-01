import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import { useLocale } from '../../contexts/LocaleContext'
import { Icon } from '../../components/UI'

// Load Stripe script
const loadStripe = () => {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve(window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...'))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.async = true
    script.onload = () => {
      resolve(window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...'))
    }
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export default function PaymentsPage(){
  const { isAuthenticated, user } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  
  const [stripe, setStripe] = useState(null)
  const [elements, setElements] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [paymentAmount, setPaymentAmount] = useState(100) // Default $100

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    initializeStripe()
  }, [isAuthenticated])

  const initializeStripe = async () => {
    try {
      const stripeInstance = await loadStripe()
      setStripe(stripeInstance)
      
      // Create payment intent
      await createPaymentIntent()
    } catch (err) {
      console.error('Stripe initialization error:', err)
      setError(locale === 'ar' ? 'فشل تهيئة الدفع' : 'Failed to initialize payment')
    }
  }

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: paymentAmount,
          currency: 'usd'
        })
      })

      const data = await response.json()
      
      if (data.ok) {
        setClientSecret(data.clientSecret)
      } else {
        setError(data.error || (locale === 'ar' ? 'فشل إنشاء نية الدفع' : 'Failed to create payment intent'))
      }
    } catch (err) {
      console.error('Payment intent creation error:', err)
      setError(locale === 'ar' ? 'فشل إنشاء نية الدفع' : 'Failed to create payment intent')
    }
  }

  const handlePaymentSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!stripe || !elements) {
      setError(locale === 'ar' ? 'لم يتم تحميل Stripe بشكل صحيح' : 'Stripe not loaded properly')
      setLoading(false)
      return
    }

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payments/success`,
        },
      })

      if (submitError) {
        setError(submitError.message)
      } else {
        setSuccess(locale === 'ar' ? 'تمت معالجة الدفع بنجاح!' : 'Payment processed successfully!')
      }
    } catch (err) {
      console.error('Payment submission error:', err)
      setError(locale === 'ar' ? 'فشل معالجة الدفع' : 'Failed to process payment')
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (amount) => {
    setPaymentAmount(amount)
    createPaymentIntent() // Recreate payment intent with new amount
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {locale === 'ar' ? 'الدفع الآمن' : 'Secure Payment'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'ادفع بأمان باستخدام طرق الدفع الموثوقة'
              : 'Pay securely using trusted payment methods'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {locale === 'ar' ? 'معلومات الدفع' : 'Payment Information'}
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <Icon icon="alert" className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <Icon icon="check" className="w-5 h-5 text-green-400 mr-2" />
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'ar' ? 'مبلغ الدفع' : 'Payment Amount'}
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => handleAmountChange(50)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        paymentAmount === 50 
                          ? 'border-primary-500 bg-primary-50 text-primary-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      $50
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAmountChange(100)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        paymentAmount === 100 
                          ? 'border-primary-500 bg-primary-50 text-primary-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      $100
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAmountChange(200)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        paymentAmount === 200 
                          ? 'border-primary-500 bg-primary-50 text-primary-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      $200
                    </button>
                  </div>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                    className="input w-full mt-4"
                    min="1"
                    placeholder={locale === 'ar' ? 'أدخل مبلغاً مخصصاً' : 'Enter custom amount'}
                  />
                </div>

                {/* Stripe Payment Element */}
                {clientSecret && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'ar' ? 'بطاقة الائتمان/الخصم' : 'Credit/Debit Card'}
                    </label>
                    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="text-center text-gray-500">
                        <Icon icon="credit-card" className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">
                          {locale === 'ar' ? 'سيتم تحميل نموذج الدفع هنا' : 'Payment form will load here'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !stripe || !elements}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner w-4 h-4 mr-2"></div>
                      {locale === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Icon icon="lock" className="w-4 h-4 mr-2" />
                      {locale === 'ar' ? `ادفع $${paymentAmount} بأمان` : `Pay $${paymentAmount} Securely`}
                    </>
                  )}
                </button>
              </form>

              {/* Security Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Icon icon="shield" className="w-4 h-4 mr-1" />
                    {locale === 'ar' ? 'مشفر SSL' : 'SSL Encrypted'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Icon icon="check" className="w-4 h-4 mr-1" />
                    {locale === 'ar' ? 'آمن 100%' : '100% Secure'}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Icon icon="credit-card" className="w-4 h-4 mr-1" />
                    {locale === 'ar' ? 'PCI DSS' : 'PCI DSS'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'ar' ? 'المبلغ الأساسي' : 'Base Amount'}
                  </span>
                  <span className="font-medium">${paymentAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'ar' ? 'رسوم المعالجة' : 'Processing Fee'}
                  </span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'ar' ? 'الضريبة' : 'Tax'}
                  </span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">
                      {locale === 'ar' ? 'الإجمالي' : 'Total'}
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      ${paymentAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'ar' ? 'طرق الدفع المقبولة' : 'Accepted Payment Methods'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center p-3 border border-gray-200 rounded">
                  <Icon icon="credit-card" className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex items-center justify-center p-3 border border-gray-200 rounded">
                  <Icon icon="smartphone" className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                {locale === 'ar' 
                  ? 'نحن نقبل جميع بطاقات الائتمان والخصم الرئيسية'
                  : 'We accept all major credit and debit cards'
                }
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <Icon icon="info" className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    {locale === 'ar' ? 'معلومات مهمة' : 'Important Information'}
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• {locale === 'ar' ? 'جميع المعاملات مشفرة' : 'All transactions are encrypted'}</li>
                    <li>• {locale === 'ar' ? 'لا نحتفظ بمعلومات بطاقتك' : 'We do not store your card information'}</li>
                    <li>• {locale === 'ar' ? 'سياسة استرداد سهلة' : 'Easy refund policy'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
