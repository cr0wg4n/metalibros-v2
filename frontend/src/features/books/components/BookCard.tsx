import { Link } from 'react-router-dom'
import type { Book } from '../types'
import { ROUTES } from '@/config/routes'

interface BookCardProps {
  book: Book
}

function BookCard({ book }: BookCardProps) {
  return (
    <article className="relative rounded-2xl border border-primary/12 bg-white p-4 shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
      <div className="absolute top-4 right-4 rounded-tr-lg rounded-bl-lg bg-accent px-3 py-2 text-xs font-semibold shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
        Bs {book.price}
      </div>

      <img className="mb-3.5 block h-75 w-full rounded-xl object-cover" src={book.cover} alt={book.coverAlt} />

      <h2 className="mb-2 text-lg font-bold text-primary">{book.title}</h2>

      <p className="line-clamp-3 text-sm text-dark/80">{book.description}</p>

      <p className="mt-2 text-right">
        <Link className="text-sm font-medium text-primary no-underline active:text-accent" to={ROUTES.login}>
          Ver más
        </Link>
      </p>
    </article>
  )
}

export default BookCard
