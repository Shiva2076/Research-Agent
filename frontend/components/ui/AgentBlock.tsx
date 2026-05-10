'use client'
import { AgentName, AgentStatus } from '@/lib/types'
import { motion } from 'framer-motion'

const TAG_STYLES: Record<AgentName, string> = {
  planner:   'bg-purple-500/15 text-purple-300 border border-purple-400/30',
  searcher:  'bg-amber-500/12 text-amber-300 border border-amber-400/30',
  ranker:    'bg-teal-400/12 text-teal-300 border border-teal-400/30',
  writer:    'bg-emerald-500/12 text-emerald-300 border border-emerald-400/30',
  factcheck: 'bg-red-500/10 text-red-300 border border-red-400/30',
  report:    'bg-green-500/10 text-green-300 border border-green-400/30',
}

const AGENT_TITLES: Record<AgentName, string> = {
  planner: 'Planner agent', searcher: 'Searcher agent', ranker: 'Ranker agent',
  writer: 'Writer agent', factcheck: 'Fact-check agent', report: 'Report assembly',
}

interface Props {
  agent: AgentName
  status: AgentStatus
  output: string
  elapsed_ms: number
}

export function AgentBlock({ agent, status, output, elapsed_ms }: Props) {
  const isRunning = status === 'running'
  const isDone = status === 'done'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl overflow-hidden border transition-all duration-300 ${
        isRunning ? 'border-purple-400/40 shadow-[0_0_20px_rgba(114,98,232,0.08)]' :
        isDone    ? 'border-white/[0.08]' : 'border-white/[0.06]'
      }`}
    >
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 border-b border-white/[0.05] ${
        isRunning ? 'bg-purple-500/[0.06]' : 'bg-[#13151C]'
      }`}>
        <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded ${TAG_STYLES[agent]}`}>
          {agent.toUpperCase()}
        </span>
        <span className="text-[12px] font-medium text-white/70">{AGENT_TITLES[agent]}</span>
        <div className="ml-auto flex items-center gap-2">
          {elapsed_ms > 0 && (
            <span className="text-[10px] font-mono text-white/30">{(elapsed_ms / 1000).toFixed(1)}s</span>
          )}
          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            isRunning ? 'bg-purple-400 pulse' :
            isDone    ? 'bg-teal-400' : 'bg-white/20'
          }`} />
        </div>
      </div>

      <div className="bg-black/20 px-3.5 py-3">
        {output ? (
          <pre className={`text-[11px] leading-relaxed whitespace-pre-wrap break-words ${
            agent === 'writer' || agent === 'report' || agent === 'factcheck'
              ? 'font-sans text-white/75' : 'font-mono text-white/60'
          }`}>{output}</pre>
        ) : isRunning ? (
          <div className="flex gap-1 items-center py-1">
            <div className="w-1 h-1 bg-purple-400 rounded-full pulse" style={{animationDelay:'0ms'}} />
            <div className="w-1 h-1 bg-purple-400 rounded-full pulse" style={{animationDelay:'200ms'}} />
            <div className="w-1 h-1 bg-purple-400 rounded-full pulse" style={{animationDelay:'400ms'}} />
          </div>
        ) : null}
      </div>

      {isDone && (
        <div className="flex gap-2 flex-wrap px-3.5 py-2 bg-white/[0.015] border-t border-white/[0.04]">
          <span className="text-[10px] font-mono text-white/35 border border-white/[0.07] rounded px-2 py-0.5">
            status: <span className="text-white/60">done</span>
          </span>
          {elapsed_ms > 0 && (
            <span className="text-[10px] font-mono text-white/35 border border-white/[0.07] rounded px-2 py-0.5">
              time: <span className="text-white/60">{(elapsed_ms/1000).toFixed(1)}s</span>
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
