export type SSECallbacks = {
  onSessionStart?: (data: any) => void
  onAgentStart?: (data: any) => void
  onAgentDone?: (data: any) => void
  onPipelineComplete?: (data: any) => void
  onError?: (data: any) => void
}

export function parseSSELine(
  line: string,
  state: { eventType: string; eventData: string },
  callbacks: SSECallbacks
): { eventType: string; eventData: string } {
  if (line.startsWith('event: ')) {
    return { ...state, eventType: line.slice(7).trim() }
  }
  if (line.startsWith('data: ')) {
    const eventData = line.slice(6).trim()
    if (state.eventType && eventData) {
      try {
        const parsed = JSON.parse(eventData)
        if (state.eventType === 'session_start') callbacks.onSessionStart?.(parsed)
        if (state.eventType === 'agent_start') callbacks.onAgentStart?.(parsed)
        if (state.eventType === 'agent_done') callbacks.onAgentDone?.(parsed)
        if (state.eventType === 'pipeline_complete') callbacks.onPipelineComplete?.(parsed)
        if (state.eventType === 'error') callbacks.onError?.(parsed)
      } catch {}
      return { eventType: '', eventData: '' }
    }
  }
  return state
}
