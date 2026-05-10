'use client'
import { AgentName, AgentStatus } from '@/lib/types'

const AGENT_LABELS: Record<AgentName, string> = {
  planner: 'Planner', searcher: 'Searcher', ranker: 'Ranker',
  writer: 'Writer', factcheck: 'Fact-check', report: 'Report'
}

const STATUS_STYLES: Record<AgentStatus, string> = {
  idle: 'border border-white/10 text-white/30 bg-transparent',
  running: 'border border-purple-400/60 bg-purple-500/15 text-purple-300',
  done: 'border border-teal-400/40 bg-teal-500/12 text-teal-300',
  error: 'border border-red-400/40 bg-red-500/10 text-red-300',
}

interface Props {
  agents: Record<AgentName, { status: AgentStatus }>
  order: AgentName[]
}

export function PipelineBar({ agents, order }: Props) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] overflow-x-auto">
      {order.map((name, i) => (
        <div key={name} className="flex items-center gap-2 flex-shrink-0">
          <div className="flex flex-col items-center gap-1">
            <span className={`text-[10px] font-mono px-2 py-1 rounded-full whitespace-nowrap transition-all duration-300 ${STATUS_STYLES[agents[name].status]}`}>
              {AGENT_LABELS[name]}
              {agents[name].status === 'running' && (
                <span className="inline-block w-1 h-1 rounded-full bg-purple-400 ml-1.5 pulse" />
              )}
            </span>
          </div>
          {i < order.length - 1 && <span className="text-white/20 text-xs">→</span>}
        </div>
      ))}
    </div>
  )
}
