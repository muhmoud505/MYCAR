import React, { useEffect, useState } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'

export default function AccountPage(){
  const { t } = useLocale()
  const [profile, setProfile] = useState(null)
  useEffect(()=>{
    let mounted = true
    api.getProfile().then(r=>{ if (mounted && r) setProfile(r.profile) }).catch(()=>{})
    return ()=>{ mounted = false }
  },[])
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">{t('pages.account')}</h1>
        {profile ? (
          <div className="mt-4 bg-white p-4 border rounded">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">Not signed in.</p>
        )}
      </main>
    </div>
  )
}
