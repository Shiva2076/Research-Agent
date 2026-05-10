'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getSession } from '@/lib/api'
import { ReportBlock } from '@/components/ui/ReportBlock'
import { AgentBlock } from '@/components/ui/AgentBlock'
import { AgentName } from '@/lib/types'
import Link from 'next/link'

const AGENT_ORDER: AgentName[] = ['planner', 'searcher', 'ranker', 'writer', 'factcheck', 'report']

export default function SessionPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSession(sessionId)
      .then(setSession)
      .catch(() => setError('Session not found'))
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:'#0D0F14'}}>
        <div className="text-[13px] font-mono text-white/40">Loading session…</div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:'#0D0F14'}}>
        <div className="text-center">
          <div className="text-[13px] text-red-300 mb-3">{error || 'Session not found'}</div>
          <Link href="/" className="text-[11px] font-mono text-purple-300 hover:text-purple-200 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background:'#0D0F14'}}>
      <div className="border-b border-white/[0.07] bg-[#13151C] px-5 py-3 flex items-center gap-3">
        <Link href="/" className="text-[11px] font-mono text-white/40 hover:text-white/70 transition-colors">
          ← Home
        </Link>
        <div className="text-[10px] font-mono text-white/20">/</div>
        <div className="text-[12px] text-white/60 truncate">{session.query}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {AGENT_ORDER.map(name => {
          const a = session.agents?.[name]
          if (!a) return null
          return (
            <AgentBlock
              key={name}
              agent={name}
              status="done"
              output={a.output}
              elapsed_ms={a.elapsed_ms}
            />
          )
        })}
        {session.final_report && (
          <ReportBlock report={session.final_report} sessionId={sessionId} />
        )}
      </div>
    </div>
  )
}
