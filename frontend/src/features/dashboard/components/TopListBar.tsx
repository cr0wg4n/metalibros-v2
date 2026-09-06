const BAR_GRADIENTS = [
  'bg-[linear-gradient(135deg,#66A3BF,#3368A0)]',
  'bg-[linear-gradient(135deg,#77B6D7,#3368A0)]',
  'bg-[linear-gradient(135deg,#B9D6C9,#66A3BF)]',
  'bg-[linear-gradient(135deg,#C8DFDB,#8CB7C2)]',
  'bg-[linear-gradient(135deg,#E8D7B9,#B7C9C8)]',
]

interface TopListBarProps {
  index: number
  label: string
  value: number
  maxValue: number
  displayValue: string
}

function TopListBar({ index, label, value, maxValue, displayValue }: TopListBarProps) {
  const widthPercent = maxValue > 0 ? Math.max(4, Math.round((value / maxValue) * 100)) : 0
  const gradient = BAR_GRADIENTS[index % BAR_GRADIENTS.length]

  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-semibold text-text">
        <span>{label}</span>
        <span>{displayValue}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-primary/12">
        <span className={`block h-full rounded-full ${gradient}`} style={{ width: `${widthPercent}%` }} />
      </div>
    </li>
  )
}

export default TopListBar
