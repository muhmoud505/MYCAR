import React from 'react'
import { useLocale } from '../contexts/LocaleContext'
import { Icon } from './UI'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en'
    setLocale(newLocale)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
      title={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Icon icon="globe" className="w-4 h-4 text-gray-600" />
      <span className="font-medium text-gray-700">
        {locale === 'ar' ? 'EN' : 'العربية'}
      </span>
    </button>
  )
}
