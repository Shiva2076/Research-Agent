'use client'
import { useEffect, useState } from 'react'
import { getHistory } from '@/lib/api'

interface HistoryItem {
  session_id: string
  query: string
  created_at: string
  metadata?: { total_elapsed_ms: number }
}

interface Props {
  onSelect: (sessionId: string, query: string) => void
}

export function HistoryScreen({ onSelect }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6">
      <h2 className="text-[14px] font-semibold text-white/70 mb-4">Research History</h2>
      {loading ? (
        <div className="text-[12px] font-mono text-white/30">Loading…</div>
      ) : history.length === 0 ? (
        <div className="text-[12px] font-mono text-white/30">No completed research sessions yet.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map(item => (
            <button
              key={item.session_id}
              onClick={() => onSelect(item.session_id, item.query)}
              className="text-left p-4 rounded-xl border border-white/[0.07] hover:border-purple-400/30 hover:bg-purple-500/[0.04] transition-all group"
            >
              <div className="text-[13px] text-white/70 group-hover:text-white/90 transition-colors mb-1">
                {item.query}
              </div>
              <div className="text-[10px] font-mono text-white/30">
                {new Date(item.created_at).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
