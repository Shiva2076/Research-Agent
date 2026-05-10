const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function getSession(sessionId: string) {
  const res = await fetch(`${API_URL}/api/sessions/${sessionId}`)
  if (!res.ok) throw new Error('Session not found')
  return res.json()
}

export async function getHistory() {
  const res = await fetch(`${API_URL}/api/history`)
  return res.json()
}

export async function exportReport(sessionId: string, format: 'pdf' | 'docx') {
  const res = await fetch(`${API_URL}/api/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, format }),
  })
  if (!res.ok) throw new Error('Export failed')
  return res.json()
}

export function createSSEConnection(query: string, callbacks: {
  onSessionStart?: (data: any) => void
  onAgentStart?: (data: any) => void
  onAgentDone?: (data: any) => void
  onPipelineComplete?: (data: any) => void
  onError?: (data: any) => void
}) {
  const controller = new AbortController()

  fetch(`${API_URL}/api/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    signal: controller.signal,
  }).then(async (res) => {
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      let eventType = ''
      let eventData = ''

      for (const line of lines) {
        if (line.startsWith('event: ')) eventType = line.slice(7).trim()
        if (line.startsWith('data: ')) {
          eventData = line.slice(6).trim()
          if (eventType && eventData) {
            const parsed = JSON.parse(eventData)
            if (eventType === 'session_start') callbacks.onSessionStart?.(parsed)
            if (eventType === 'agent_start') callbacks.onAgentStart?.(parsed)
            if (eventType === 'agent_done') callbacks.onAgentDone?.(parsed)
            if (eventType === 'pipeline_complete') callbacks.onPipelineComplete?.(parsed)
            if (eventType === 'error') callbacks.onError?.(parsed)
            eventType = ''
            eventData = ''
          }
        }
      }
    }
  }).catch((err) => {
    if (err.name !== 'AbortError') callbacks.onError?.({ error: err.message })
  })

  return () => controller.abort()
}
