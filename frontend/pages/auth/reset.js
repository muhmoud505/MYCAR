import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { api } from '../../utils/api'

export default function Reset(){
  const router = useRouter()
  const { token } = router.query
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState(null)

  useEffect(()=>{
    if(!token) setStatus('no-token')
  },[token])

  async function handleSubmit(e){
    e.preventDefault()
    setStatus('loading')
    try{
      await api.resetPassword({ token, newPassword })
      setStatus('success')
      setTimeout(()=> router.push('/auth/login'), 1200)
    }catch(err){
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {!token ? (
          <div className="bg-white p-6 rounded shadow">Missing token.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <div>
              <label className="block text-sm">New password</label>
              <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full mt-1 p-2 border rounded" />
            </div>
            {status === 'success' && <div className="text-green-600">Password updated — redirecting...</div>}
            {status === 'error' && <div className="text-red-600">Failed to reset password.</div>}
            <button disabled={status==='loading'} className="w-full py-2 bg-indigo-600 text-white rounded">Reset password</button>
          </form>
        )}
      </main>
    </div>
  )
}
