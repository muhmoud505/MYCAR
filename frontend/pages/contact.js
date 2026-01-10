import React from 'react'
import { useLocale } from '../contexts/LocaleContext'

export default function ContactPage(){
  const { t } = useLocale()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold">{t('pages.contact')}</h1>
      <p className="mt-4">{t('pages.contact')}</p>
    </div>
  )
}
