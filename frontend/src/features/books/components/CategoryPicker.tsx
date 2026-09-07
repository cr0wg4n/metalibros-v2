import { useEffect, useState, type KeyboardEvent } from 'react'
import Button from '@/components/ui/Button'
import { listCategories, createCategory, type ApiCategory } from '../services/categories-service'

interface CategoryPickerProps {
  value: string[]
  onChange: (categoryIds: string[]) => void
}

function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setError('No se pudieron cargar las categorías'))
  }, [])

  function toggleCategory(id: string) {
    onChange(value.includes(id) ? value.filter((existingId) => existingId !== id) : [...value, id])
  }

  async function handleAddCategory() {
    const name = newCategoryName.trim()
    if (!name) return

    setIsCreating(true)
    setError(null)

    try {
      const category = await createCategory(name)
      setCategories((prev) => [...prev, category])
      onChange([...value, category.id])
      setNewCategoryName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la categoría')
    } finally {
      setIsCreating(false)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddCategory()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold text-primary">Categorías</span>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = value.includes(category.id)
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-primary/30 text-primary hover:bg-primary/5'
                }`}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-primary bg-white px-3 py-2 text-sm text-text focus:outline focus:outline-primary"
          value={newCategoryName}
          onChange={(event) => setNewCategoryName(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nueva categoría"
        />
        <Button
          type="button"
          variant="secondary"
          className="px-4 py-2 text-sm"
          onClick={handleAddCategory}
          disabled={isCreating || !newCategoryName.trim()}
        >
          Agregar
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default CategoryPicker
