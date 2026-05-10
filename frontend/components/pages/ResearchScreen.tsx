'use client'
import { AnimatePresence } from 'framer-motion'
import { AgentName, AgentOutput, AgentStatus } from '@/lib/types'
import { PipelineBar } from '@/components/ui/PipelineBar'
import { AgentBlock } from '@/components/ui/AgentBlock'
import { ReportBlock } from '@/components/ui/ReportBlock'

interface Props {
  query: string
  sessionId: string | null
  isRunning: boolean
  agents: Record<AgentName, AgentOutput>
  finalReport: string | null
  activeAgent: AgentName | null
  error: string | null
  agentOrder: AgentName[]
  onStop: () => void
  onNew: () => void
}

export function ResearchScreen({
  query, sessionId, isRunning, agents, finalReport,
  activeAgent, error, agentOrder, onStop, onNew
}: Props) {
  const doneAgents = agentOrder.filter(a => agents[a].status === 'done')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="border-b border-white/[0.06] bg-[#13151C] px-5 py-3">
        <div className="text-[12px] font-mono text-white/40 mb-1">// research_query</div>
        <div className="flex gap-2 items-center">
          <div className="flex-1 bg-[#1A1D26] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white/60 font-mono truncate">
            {query}
          </div>
          {isRunning ? (
            <button onClick={onStop} className="text-[11px] px-4 py-2 rounded-lg border border-white/10 text-white/40 hover:text-white/70 transition-colors bg-white/[0.03]">
              ■ Stop
            </button>
          ) : (
            <button onClick={onNew} className="text-[11px] px-4 py-2 rounded-lg border border-white/10 text-white/40 hover:text-white/70 transition-colors bg-white/[0.03]">
              + New
            </button>
          )}
        </div>
      </div>

      <PipelineBar agents={agents} order={agentOrder} />

      {isRunning && (
        <div className="px-5 py-2 bg-purple-500/[0.04] border-b border-purple-400/10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full pulse" />
            <span className="text-[11px] font-mono text-purple-300/70">
              {activeAgent ? `${activeAgent} agent running…` : 'initialising pipeline…'}
            </span>
            <span className="ml-auto text-[10px] font-mono text-white/25">
              {doneAgents.length}/{agentOrder.length} nodes complete
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        <AnimatePresence>
          {agentOrder.map(name => {
            const a = agents[name]
            if (a.status === 'idle') return null
            return (
              <AgentBlock
                key={name}
                agent={name}
                status={a.status}
                output={a.output}
                elapsed_ms={a.elapsed_ms}
              />
            )
          })}
        </AnimatePresence>

        {finalReport && (
          <ReportBlock report={finalReport} sessionId={sessionId} />
        )}

        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/[0.06] p-4">
            <div className="text-[12px] font-semibold text-red-300 mb-1">Pipeline error</div>
            <div className="text-[11px] text-red-300/70 font-mono">{error}</div>
            <button onClick={onNew} className="mt-3 text-[11px] px-4 py-1.5 rounded border border-red-400/30 text-red-300 hover:bg-red-400/10 transition-colors">
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
