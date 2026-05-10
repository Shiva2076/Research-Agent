'use client'

interface Props {
  sourcesText: string
}

export function SourcesList({ sourcesText }: Props) {
  const sources = sourcesText.split('[SOURCE').filter(Boolean).map(s => '[SOURCE' + s)

  return (
    <div className="flex flex-col gap-2">
      {sources.map((src, i) => {
        const titleMatch = src.match(/Title:\s*(.+)/)
        const urlMatch = src.match(/URL:\s*(\S+)/)
        const snippetMatch = src.match(/Snippet:\s*([\s\S]+)/)
        const relevanceMatch = src.match(/Relevance:\s*(\w+)/)

        return (
          <div key={i} className="text-[11px] border border-white/[0.06] rounded-lg p-3 bg-white/[0.02]">
            <div className="font-medium text-white/70 mb-0.5">{titleMatch?.[1]}</div>
            {urlMatch && (
              <div className="font-mono text-purple-300/50 text-[10px] mb-1 truncate">{urlMatch[1]}</div>
            )}
            {snippetMatch && (
              <div className="text-white/45 leading-relaxed">{snippetMatch[1].slice(0, 150)}...</div>
            )}
            {relevanceMatch && (
              <div className={`mt-1 text-[9px] font-mono uppercase ${
                relevanceMatch[1] === 'high' ? 'text-teal-400' :
                relevanceMatch[1] === 'medium' ? 'text-amber-400' : 'text-white/30'
              }`}>{relevanceMatch[1]}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
