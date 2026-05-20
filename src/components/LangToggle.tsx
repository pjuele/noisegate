'use client'

import { useLang } from './LangProvider'

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex items-center gap-1 font-mono text-xs">
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-0.5 border transition-colors ${lang === 'en' ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('es')}
        className={`px-2 py-0.5 border transition-colors ${lang === 'es' ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
      >
        ES
      </button>
    </div>
  )
}
