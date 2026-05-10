'use client'
import { useResearch } from '@/hooks/useResearch'
import { Header } from '@/components/layout/Header'
import { WelcomeScreen } from '@/components/pages/WelcomeScreen'
import { ResearchScreen } from '@/components/pages/ResearchScreen'

export default function Home() {
  const {
    query, setQuery, sessionId, isRunning,
    agents, finalReport, activeAgent, error,
    runResearch, stopResearch, reset, agentOrder
  } = useResearch()

  const hasStarted = Object.values(agents).some(a => a.status !== 'idle')

  return (
    <div className="min-h-screen flex flex-col" style={{background:'#0D0F14'}}>
      <Header
        isRunning={isRunning}
        sessionId={sessionId}
        onNew={reset}
      />

      {!hasStarted ? (
        <WelcomeScreen
          query={query}
          setQuery={setQuery}
          onSubmit={runResearch}
        />
      ) : (
        <ResearchScreen
          query={query}
          sessionId={sessionId}
          isRunning={isRunning}
          agents={agents}
          finalReport={finalReport}
          activeAgent={activeAgent}
          error={error}
          agentOrder={agentOrder}
          onStop={stopResearch}
          onNew={reset}
        />
      )}
    </div>
  )
}
