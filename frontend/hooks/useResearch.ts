'use client'
import { useState, useCallback, useRef } from 'react'
import { createSSEConnection } from '@/lib/api'
import { AgentName, AgentOutput, AgentStatus } from '@/lib/types'

const AGENT_ORDER: AgentName[] = ['planner', 'searcher', 'ranker', 'writer', 'factcheck', 'report']

const initialAgents = () => Object.fromEntries(
  AGENT_ORDER.map(a => [a, { agent: a, output: '', elapsed_ms: 0, status: 'idle' as AgentStatus }])
) as Record<AgentName, AgentOutput>

export function useResearch() {
  const [query, setQuery] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [agents, setAgents] = useState<Record<AgentName, AgentOutput>>(initialAgents())
  const [finalReport, setFinalReport] = useState<string | null>(null)
  const [activeAgent, setActiveAgent] = useState<AgentName | null>(null)
  const [error, setError] = useState<string | null>(null)
  const stopRef = useRef<(() => void) | null>(null)

  const runResearch = useCallback((q: string) => {
    if (!q.trim() || isRunning) return

    setIsRunning(true)
    setAgents(initialAgents())
    setFinalReport(null)
    setActiveAgent(null)
    setError(null)

    const stop = createSSEConnection(q, {
      onSessionStart: (data) => setSessionId(data.session_id),
      onAgentStart: (data) => {
        setActiveAgent(data.agent)
        setAgents(prev => ({
          ...prev,
          [data.agent]: { ...prev[data.agent as AgentName], status: 'running' }
        }))
      },
      onAgentDone: (data) => {
        setAgents(prev => ({
          ...prev,
          [data.agent]: {
            agent: data.agent,
            output: data.output,
            elapsed_ms: data.elapsed_ms,
            status: 'done'
          }
        }))
      },
      onPipelineComplete: (data) => {
        setFinalReport(data.final_report)
        setActiveAgent(null)
        setIsRunning(false)
      },
      onError: (data) => {
        setError(data.error)
        setIsRunning(false)
      }
    })

    stopRef.current = stop
  }, [isRunning])

  const stopResearch = useCallback(() => {
    stopRef.current?.()
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    stopRef.current?.()
    setAgents(initialAgents())
    setFinalReport(null)
    setActiveAgent(null)
    setError(null)
    setSessionId(null)
    setIsRunning(false)
    setQuery('')
  }, [])

  return {
    query, setQuery,
    sessionId, isRunning,
    agents, finalReport,
    activeAgent, error,
    runResearch, stopResearch, reset,
    agentOrder: AGENT_ORDER
  }
}
