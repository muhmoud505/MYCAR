import { useState } from 'react'
import Navbar from '../../components/Navbar'
import { useLocale } from '../../contexts/LocaleContext'
import { api } from '../../utils/api'

export default function Forgot(){
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  async function handleSubmit(e){
    e.preventDefault()
    setStatus('loading')
    try{
      await api.forgotPassword({ email })
      setStatus('sent')
    }catch(err){
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{t('form.forgotPassword')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm">{t('form.email')}</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded" />
          </div>
          {status === 'sent' && <div className="text-green-600">{t('form.resetSent')}</div>}
          {status === 'error' && <div className="text-red-600">{t('form.resetError')}</div>}
          <button disabled={status==='loading'} className="w-full py-2 bg-blue-600 text-white rounded">{t('form.sendResetLink')}</button>
        </form>
      </main>
    </div>
  )
}
