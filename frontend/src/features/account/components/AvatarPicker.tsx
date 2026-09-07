import { useState, type ChangeEvent } from 'react'
import { uploadAvatar } from '../services/profile-service'

interface AvatarPickerProps {
  avatarUrl?: string
  onUploaded: (avatar: string | null) => void
}

function AvatarPicker({ avatarUrl, onUploaded }: AvatarPickerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      const profile = await uploadAvatar(file)
      onUploaded(profile.avatar)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la foto de perfil')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <label
        htmlFor="avatar"
        className="relative block h-30 w-30 cursor-pointer rounded-full border-2 border-secondary shadow-[0_0_30px_rgba(51,104,160,0.18)]"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Foto de perfil" className="h-full w-full rounded-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-alt text-sm text-muted">
            Sin foto
          </div>
        )}
        <span className="absolute -right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary/20 bg-white text-lg font-bold text-primary shadow">
          +
        </span>
      </label>

      <input
        id="avatar"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {isUploading && <p className="text-xs text-muted">Subiendo…</p>}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default AvatarPicker
