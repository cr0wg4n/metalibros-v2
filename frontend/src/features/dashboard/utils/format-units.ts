export function formatUnits(count: number): string {
  return `${count} unidad${count === 1 ? '' : 'es'}`
}
