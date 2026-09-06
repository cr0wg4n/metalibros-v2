import type { Book } from '../types'
import BookCard from './BookCard'
import { ROUTES } from '@/config/routes'

interface BooksGridProps {
  books: Book[]
}

function BooksGrid({ books }: BooksGridProps) {
  return (
    <div className="mx-auto grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
          description={book.description}
          price={book.price}
          imageUrl={book.cover}
          imageAlt={book.coverAlt}
          viewMoreHref={ROUTES.login}
        />
      ))}
    </div>
  )
}

export default BooksGrid
