'use client'

const SAMPLE_QUERIES = [
  'Latest breakthroughs in multi-agent AI systems 2025',
  'How does LangGraph compare to CrewAI for production systems?',
  'UAE vertical farming market opportunities and challenges',
  'Best practices for RAG systems in enterprise applications',
]

interface Props {
  query: string
  setQuery: (q: string) => void
  onSubmit: (q: string) => void
}

export function WelcomeScreen({ query, setQuery, onSubmit }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16">
      <div className="w-14 h-14 bg-[#7262E8] rounded-2xl flex items-center justify-center mb-6">
        <div className="w-7 h-7 bg-white/90 rounded-sm" style={{clipPath:'polygon(0 40%,40% 40%,40% 0,60% 0,60% 40%,100% 40%,100% 60%,60% 60%,60% 100%,40% 100%,40% 60%,0 60%)'}} />
      </div>
      <h1 className="text-2xl font-semibold text-white/90 mb-2 text-center">Research Agent</h1>
      <p className="text-[13px] text-white/40 font-mono mb-10 text-center">real-time streaming</p>

      <div className="w-full max-w-xl">
        <div className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit(query)}
            placeholder="Enter a research question…"
            className="flex-1 bg-[#1A1D26] border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white/80 placeholder-white/25 outline-none focus:border-purple-400/50 transition-colors"
          />
          <button
            onClick={() => onSubmit(query)}
            disabled={!query.trim()}
            className="bg-[#7262E8] hover:bg-[#6153d4] disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-[13px] px-5 py-3 rounded-xl transition-colors"
          >
            Run
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); onSubmit(q) }}
              className="text-[11px] px-3 py-1.5 rounded-full border border-white/[0.08] text-white/35 hover:text-white/60 hover:border-white/15 transition-all"
            >
              {q.length > 45 ? q.slice(0, 45) + '…' : q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
