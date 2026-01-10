import React from 'react'
import { useRouter } from 'next/router'
import { useLocale } from '../../contexts/LocaleContext'

export default function ListingDetailsPage(){
  const router = useRouter()
  const { id } = router.query || {}
  const { t } = useLocale()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold">{t('pages.listingDetails')}</h1>
      <p className="mt-4">{id ? `${t('pages.listingDetails')} — ${id}` : t('pages.listingDetails')}</p>
    </div>
  )
}
