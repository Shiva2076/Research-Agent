'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { exportReport } from '@/lib/api'

interface Props {
  report: string
  sessionId: string | null
}

export function ReportBlock({ report, sessionId }: Props) {
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null)

  const copyReport = () => {
    navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!sessionId) return
    setExporting(format)
    try {
      const result = await exportReport(sessionId, format)
      window.open(result.url, '_blank')
    } catch (e) {
      console.error('Export failed', e)
    } finally {
      setExporting(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-teal-400/30 overflow-hidden"
    >
      <div className="flex items-center gap-2.5 px-4 py-3 bg-teal-500/[0.08] border-b border-teal-400/20">
        <span className="text-teal-400 text-sm">⬡</span>
        <span className="text-[13px] font-semibold text-teal-300">Final report</span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={copyReport}
            className="text-[10px] font-mono px-3 py-1 rounded border border-teal-400/30 text-teal-300 hover:bg-teal-400/10 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={!sessionId || exporting === 'pdf'}
            className="text-[10px] font-mono px-3 py-1 rounded border border-teal-400/30 text-teal-300 hover:bg-teal-400/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {exporting === 'pdf' ? '...' : 'PDF'}
          </button>
          <button
            onClick={() => handleExport('docx')}
            disabled={!sessionId || exporting === 'docx'}
            className="text-[10px] font-mono px-3 py-1 rounded border border-teal-400/30 text-teal-300 hover:bg-teal-400/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {exporting === 'docx' ? '...' : 'DOCX'}
          </button>
        </div>
      </div>
      <div className="p-5 bg-black/15 prose prose-invert prose-sm max-w-none
        prose-headings:text-teal-300 prose-headings:font-semibold prose-headings:text-xs
        prose-headings:uppercase prose-headings:tracking-wider prose-headings:mt-4 prose-headings:mb-2
        prose-p:text-white/70 prose-p:text-[13px] prose-p:leading-relaxed
        prose-li:text-white/70 prose-li:text-[13px]
        prose-strong:text-white/90">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>
    </motion.div>
  )
}
