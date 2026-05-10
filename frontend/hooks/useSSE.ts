'use client'
import { useRef, useCallback } from 'react'

export function useSSE() {
  const controllerRef = useRef<AbortController | null>(null)

  const connect = useCallback((url: string, body: any, onEvent: (type: string, data: any) => void) => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim()
          } else if (line.startsWith('data: ') && eventType) {
            try {
              const data = JSON.parse(line.slice(6).trim())
              onEvent(eventType, data)
            } catch {}
            eventType = ''
          }
        }
      }
    }).catch((err) => {
      if (err.name !== 'AbortError') onEvent('error', { error: err.message })
    })

    return () => controller.abort()
  }, [])

  const disconnect = useCallback(() => {
    controllerRef.current?.abort()
  }, [])

  return { connect, disconnect }
}
