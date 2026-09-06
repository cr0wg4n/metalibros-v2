interface InsightCardProps {
  label: string
  value: string
}

function InsightCard({ label, value }: InsightCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-primary/8 bg-white p-6 shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-br from-secondary to-primary" />
      <span className="mb-3 block text-sm text-text/80">{label}</span>
      <strong className="block text-3xl font-bold text-primary">{value}</strong>
    </article>
  )
}

export default InsightCard
