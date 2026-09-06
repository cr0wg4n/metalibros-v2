import { Link } from 'react-router-dom'

interface BookCardProps {
  title: string
  author: string
  description: string
  price: number
  imageUrl?: string
  imageAlt: string
  viewMoreHref?: string
}

function BookCard({ title, author, description, price, imageUrl, imageAlt, viewMoreHref }: BookCardProps) {
  return (
    <article className="relative rounded-2xl border border-primary/12 bg-white p-4 shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
      <div className="absolute top-4 right-4 rounded-tr-lg rounded-bl-lg bg-accent px-3 py-2 text-xs font-semibold shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
        Bs {price}
      </div>

      {imageUrl ? (
        <img className="mb-3.5 block h-75 w-full rounded-xl object-cover" src={imageUrl} alt={imageAlt} />
      ) : (
        <div className="mb-3.5 flex h-75 w-full items-center justify-center rounded-xl bg-surface-alt text-sm text-muted">
          Sin portada
        </div>
      )}

      <h2 className="text-lg font-bold text-primary">{title}</h2>
      <p className="mb-2 text-sm text-muted">{author}</p>

      <p className="line-clamp-3 text-sm text-dark/80">{description}</p>

      {viewMoreHref && (
        <p className="mt-2 text-right">
          <Link className="text-sm font-medium text-primary no-underline active:text-accent" to={viewMoreHref}>
            Ver más
          </Link>
        </p>
      )}
    </article>
  )
}

export default BookCard
