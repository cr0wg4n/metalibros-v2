import { useEffect, useState } from 'react'
import DashboardNav from '@/features/dashboard/components/DashboardNav'
import AvatarPicker from '@/features/account/components/AvatarPicker'
import ProfileForm, { type ProfileFormValues } from '@/features/account/components/ProfileForm'
import { profileSchema } from '@/features/account/schemas/profile-schema'
import { getProfile, updateProfile, resolveAvatarUrl, type ApiProfile } from '@/features/account/services/profile-service'
import { useAuthStore } from '@/store/auth-store'

type FieldErrors = Partial<Record<keyof ProfileFormValues, string>>

function ProfilePage() {
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const [profile, setProfile] = useState<ApiProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isInitializing) return

    getProfile()
      .then(setProfile)
      .catch(() => setLoadError('No se pudo cargar tu perfil'))
      .finally(() => setIsLoading(false))
  }, [isInitializing])

  async function handleSubmit(values: ProfileFormValues) {
    setFormError(null)
    setSuccessMessage(null)

    const result = profileSchema.safeParse(values)
    if (!result.success) {
      const errors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        errors[field] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const updated = await updateProfile(result.data)
      setProfile(updated)
      setSuccessMessage('Perfil actualizado correctamente.')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo actualizar el perfil')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleAvatarUploaded(avatar: string | null) {
    setProfile((prev) => (prev ? { ...prev, avatar } : prev))
  }

  return (
    <section className="w-full pb-8" aria-label="Contenido principal del dashboard">
      <DashboardNav title="Perfil de usuario" />

      <div className="p-6">
        {isLoading && <p className="text-muted">Cargando perfil…</p>}

        {loadError && (
          <p className="text-red-600" role="alert">
            {loadError}
          </p>
        )}

        {profile && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-primary/12 bg-white p-8 shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
            <div className="mb-6 flex justify-center">
              <AvatarPicker avatarUrl={resolveAvatarUrl(profile.avatar)} onUploaded={handleAvatarUploaded} />
            </div>

            {successMessage && <p className="mb-4 text-center text-sm text-success">{successMessage}</p>}

            <ProfileForm
              initialValues={{
                name: profile.name,
                email: profile.email,
                about: profile.about ?? '',
                phone: profile.phone ?? '',
              }}
              fieldErrors={fieldErrors}
              formError={formError}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default ProfilePage
