import { formatUnits } from '../utils/format-units'

interface BreakdownItem {
  label: string
  value: number
}

interface BreakdownChartProps {
  items: BreakdownItem[]
  emptyMessage: string
}

const CATEGORY_GRADIENTS = [
  '#66A3BF',
  '#77B6D7',
  '#B9D6C9',
  '#C8DFDB',
  '#E8D7B9',
]
const OTHER_BACKGROUND = '#94A3B8'
const MAX_SLOTS = CATEGORY_GRADIENTS.length

interface ChartSegment {
  label: string
  value: number
  background: string
}

function buildSegments(items: BreakdownItem[]): ChartSegment[] {
  const shown = items.slice(0, MAX_SLOTS).map((item, index) => ({
    label: item.label,
    value: item.value,
    background: CATEGORY_GRADIENTS[index],
  }))

  const rest = items.slice(MAX_SLOTS)
  if (rest.length > 0) {
    shown.push({
      label: 'Otros',
      value: rest.reduce((sum, item) => sum + item.value, 0),
      background: OTHER_BACKGROUND,
    })
  }

  return shown
}

function BreakdownChart({ items, emptyMessage }: BreakdownChartProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted">{emptyMessage}</p>
  }

  const segments = buildSegments(items)
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex h-6 w-full gap-0.5 overflow-hidden rounded-full bg-white"
        role="img"
        aria-label={`Distribución: ${segments.map((segment) => `${segment.label}, ${formatUnits(segment.value)}`).join('; ')}`}
      >
        {segments.map((segment) => {
          const percent = total > 0 ? Math.round((segment.value / total) * 100) : 0
          return (
            <span
              key={segment.label}
              className="h-full"
              style={{ flexGrow: segment.value || 0.0001, flexBasis: 0, background: segment.background }}
              title={`${segment.label}: ${formatUnits(segment.value)} (${percent}%)`}
            />
          )
        })}
      </div>

      <ul className="flex flex-col gap-2">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: segment.background }}
              aria-hidden="true"
            />
            <span className="flex-1 font-medium text-text">{segment.label}</span>
            <span className="text-muted">{formatUnits(segment.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BreakdownChart
