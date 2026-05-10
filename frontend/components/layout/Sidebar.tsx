'use client'
import { useEffect, useState } from 'react'
import { getHistory } from '@/lib/api'

interface HistoryItem {
  session_id: string
  query: string
  created_at: string
}

interface Props {
  onSelect?: (sessionId: string, query: string) => void
  currentSessionId?: string | null
}

export function Sidebar({ onSelect, currentSessionId }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    getHistory().then(setHistory).catch(() => {})
  }, [currentSessionId])

  return (
    <div className="w-60 border-r border-white/[0.07] bg-[#13151C] flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">History</div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {history.length === 0 ? (
          <div className="px-4 py-3 text-[11px] text-white/25 font-mono">No past research</div>
        ) : (
          history.map(item => (
            <button
              key={item.session_id}
              onClick={() => onSelect?.(item.session_id, item.query)}
              className={`w-full text-left px-4 py-2.5 hover:bg-white/[0.04] transition-colors group ${
                currentSessionId === item.session_id ? 'bg-purple-500/[0.08]' : ''
              }`}
            >
              <div className="text-[11px] text-white/60 group-hover:text-white/80 transition-colors line-clamp-2 leading-relaxed">
                {item.query}
              </div>
              <div className="text-[9px] font-mono text-white/25 mt-0.5">
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
