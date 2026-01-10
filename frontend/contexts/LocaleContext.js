import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '../locales/en.json'
import ar from '../locales/ar.json'

const locales = { en, ar }

const LocaleContext = createContext({})

export function LocaleProvider({ children, initialLocale }){
  const [locale, setLocale] = useState(() => {
    try {
      if (initialLocale) return initialLocale
      return (typeof window !== 'undefined' && localStorage.getItem('locale')) || 'en'
    } catch(e){ return initialLocale || 'en' }
  })

  useEffect(()=>{
    try { localStorage.setItem('locale', locale) } catch(e){}
    try { if (typeof document !== 'undefined'){
      document.documentElement.lang = locale
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
      // persist to cookie so SSR can read it next request
      document.cookie = `locale=${locale}; path=/; max-age=${60*60*24*365}`
    }} catch(e){}
  }, [locale])

  const t = (path) => {
    const keys = String(path || '').split('.')
    let cur = locales[locale] || locales.en
    for (const k of keys){
      if (!cur) return path
      cur = cur[k]
    }
    return cur === undefined ? path : cur
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(){
  return useContext(LocaleContext)
}

export default LocaleContext
