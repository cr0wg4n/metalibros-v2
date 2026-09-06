import MetricPanel from './MetricPanel'
import TopListBar from './TopListBar'

interface TopListItem {
  label: string
  value: number
  displayValue: string
}

interface TopListPanelProps {
  title: string
  items: TopListItem[]
  emptyMessage: string
}

function TopListPanel({ title, items, emptyMessage }: TopListPanelProps) {
  const maxValue = items.reduce((max, item) => Math.max(max, item.value), 0)

  return (
    <MetricPanel title={title}>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{emptyMessage}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((item, index) => (
            <TopListBar
              key={item.label}
              index={index}
              label={item.label}
              value={item.value}
              maxValue={maxValue}
              displayValue={item.displayValue}
            />
          ))}
        </ul>
      )}
    </MetricPanel>
  )
}

export default TopListPanel
