import { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import ErrorAlert from '../../components/ErrorAlert'
import { useLocale } from '../../contexts/LocaleContext'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../utils/api'
import { parseApiError, validateEmail, validatePassword, validateRequired } from '../../utils/errorHandling'

export default function Register(){
  const { t } = useLocale()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    
    // Client-side validation
    try {
      validateRequired(name, 'Name')
      validateEmail(email)
      validatePassword(password)
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }
    } catch (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try{
      const res = await api.register({ email, password, name })
      // Auto-login after successful registration
      login(res.token, res.user)
      router.push('/')
    }catch(err){
      const parsedError = parseApiError(err)
      setError(parsedError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{t('form.createAccount')}</h1>
        
        <ErrorAlert 
          error={error} 
          onDismiss={() => setError(null)} 
        />
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.name')}
            </label>
            <input 
              type="text"
              value={name} 
              onChange={e=>setName(e.target.value)} 
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.email')}
            </label>
            <input 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('form.password')}
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Create a password (min 6 characters)"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e=>setConfirmPassword(e.target.value)} 
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-success-600 text-white rounded-md hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating account...
              </>
            ) : (
              t('form.createAccount')
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
            {t('form.signIn')}
          </a>
        </div>
      </main>
    </div>
  )
}
