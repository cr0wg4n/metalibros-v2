import type { ReactNode } from 'react'

interface MetricPanelProps {
  title: string
  children: ReactNode
}

function MetricPanel({ title, children }: MetricPanelProps) {
  return (
    <section className="rounded-2xl border border-primary/12 bg-white p-6 shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
      <h2 className="mb-4 text-lg font-bold text-primary">{title}</h2>
      {children}
    </section>
  )
}

export default MetricPanel
