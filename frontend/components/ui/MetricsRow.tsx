'use client'
import { AgentName, AgentOutput } from '@/lib/types'

interface Props {
  agents: Record<AgentName, AgentOutput>
  order: AgentName[]
}

export function MetricsRow({ agents, order }: Props) {
  const doneAgents = order.filter(a => agents[a].status === 'done')
  const totalMs = doneAgents.reduce((sum, a) => sum + agents[a].elapsed_ms, 0)

  if (doneAgents.length === 0) return null

  return (
    <div className="flex gap-3 px-5 py-2 border-b border-white/[0.04] text-[10px] font-mono text-white/30">
      <span>{doneAgents.length}/{order.length} agents done</span>
      <span>·</span>
      <span>total: {(totalMs / 1000).toFixed(1)}s</span>
    </div>
  )
}
