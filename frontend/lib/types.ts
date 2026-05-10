export type AgentName = 'planner' | 'searcher' | 'ranker' | 'writer' | 'factcheck' | 'report'
export type AgentStatus = 'idle' | 'running' | 'done' | 'error'

export interface AgentOutput {
  agent: AgentName
  output: string
  elapsed_ms: number
  status: AgentStatus
}

export interface ResearchSession {
  session_id: string
  query: string
  status: 'running' | 'complete' | 'failed'
  agents: Record<AgentName, AgentOutput>
  final_report: string | null
  created_at: string
}

export interface SSEEvent {
  event: string
  data: any
}
