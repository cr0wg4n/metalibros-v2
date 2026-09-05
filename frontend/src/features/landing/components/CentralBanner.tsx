interface CentralBannerProps {
  title: string
  subtitle: string
}

function CentralBanner({ title, subtitle }: CentralBannerProps) {
  return (
    <section
      className="flex min-h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-secondary to-primary p-8"
      aria-label="Hero banner"
    >
      <div className="text-center text-white">
        <h1 className="text-4xl leading-tight font-bold">{title}</h1>
        <p className="mt-2 text-base opacity-90">{subtitle}</p>
      </div>
    </section>
  )
}

export default CentralBanner
