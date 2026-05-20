import { Eyebrow } from '@/components/nono'

export default function UruguayPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-20 text-center">
        <h1 className="font-mono font-normal tracking-tighter leading-none text-[10rem] mb-8">
          uruguay
        </h1>
        <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed font-mono">
          Uruguay news, noise filtered by AI — coming soon.
        </p>
      </div>
      <Eyebrow>Noise Gate · powered by Gemini</Eyebrow>
    </main>
  )
}
