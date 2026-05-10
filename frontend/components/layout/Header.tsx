'use client'

interface Props {
  isRunning?: boolean
  sessionId?: string | null
  onNew?: () => void
}

export function Header({ isRunning, sessionId, onNew }: Props) {
  return (
    <div className="border-b border-white/[0.07] bg-[#13151C] px-5 py-3 flex items-center gap-3">
      <div className="w-7 h-7 bg-[#7262E8] rounded-lg flex items-center justify-center">
        <div className="w-3.5 h-3.5 bg-white/90 rounded-sm" style={{clipPath:'polygon(0 40%,40% 40%,40% 0,60% 0,60% 40%,100% 40%,100% 60%,60% 60%,60% 100%,40% 100%,40% 60%,0 60%)'}} />
      </div>
      <div>
        <div className="text-[13px] font-semibold text-white/90">Research Agent</div>
        <div className="text-[10px] text-white/35 font-mono">langgraph · rag</div>
      </div>
      {isRunning && (
        <div className="ml-auto flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full pulse" />
          <span className="text-[11px] text-white/40 font-mono">running…</span>
        </div>
      )}
      {sessionId && !isRunning && onNew && (
        <button onClick={onNew} className="ml-auto text-[11px] font-mono text-white/40 hover:text-white/70 transition-colors border border-white/10 rounded px-3 py-1">
          + New research
        </button>
      )}
    </div>
  )
}
