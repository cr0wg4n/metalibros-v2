import CentralBanner from '../components/CentralBanner'
import BooksGrid from '@/features/books/components/BooksGrid'
import { featuredBooks } from '@/features/books/data/featured-books'
import Footer from '@/components/layout/Footer'
import WhatsappBubble from '@/components/common/WhatsappBubble'

function LandingPage() {
  return (
    <div className="relative">
      <CentralBanner
        title="Metalibros"
        subtitle="Tu librería digital para descubrir, guardar y comprar tus libros favoritos."
      />

      <section className="px-5 pt-8 pb-12" aria-label="Featured books">
        <BooksGrid books={featuredBooks} />
      </section>

      <Footer />

      <WhatsappBubble />
    </div>
  )
}

export default LandingPage
