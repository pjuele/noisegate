'use client'

import { useLang } from './LangProvider'

const COPY = {
  en: "Factual updates on the Uruguay men's national team — results, call-ups, injuries, availability. Noise filtered by AI.",
  es: 'Actualizaciones sobre la selección uruguaya masculina — resultados, convocatorias, lesiones, disponibilidad. Ruido filtrado por IA.',
}

export function Subtitle() {
  const { lang } = useLang()
  return (
    <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed font-mono">
      {COPY[lang]}
    </p>
  )
}
