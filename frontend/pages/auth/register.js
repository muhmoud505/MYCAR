import { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { useLocale } from '../../contexts/LocaleContext'
import { api } from '../../utils/api'

export default function Register(){
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      await api.register({ email, password, name })
      router.push('/auth/login')
    }catch(err){
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{t('form.createAccount')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm">{t('form.name')}</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">{t('form.email')}</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">{t('form.password')}</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <button className="w-full py-2 bg-green-600 text-white rounded">{t('form.createAccount')}</button>
        </form>
      </main>
    </div>
  )
}
