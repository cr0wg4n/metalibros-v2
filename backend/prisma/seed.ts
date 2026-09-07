import 'dotenv/config'
import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../src/generated/prisma/client.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! }),
})

const CATEGORY_NAMES = ['Ciencia Ficción', 'Filosofía', 'Clásicos', 'Pensamiento Crítico', 'Romance', 'Política']
const CITIES = ['La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Tarija', 'Chuquisaca', 'Beni', 'Pando']
const INITIAL_STOCK_PER_BOOK = 20
const MAX_SALES_PER_BOOK = 6

interface SeedBook {
  name: string
  author: string
  description: string
  sellingPrice: number
  costPrice: number
  releaseDate: string
  image: string
  categories: string[]
}

const BOOKS: SeedBook[] = [
  {
    name: 'Dune',
    author: 'Frank Herbert',
    description:
      'Una historia épica sobre poder, destino y supervivencia en un planeta desértico donde la especia determina el futuro del universo.',
    sellingPrice: 120,
    costPrice: 70,
    releaseDate: '1965-08-01',
    image: 'dune.jpg',
    categories: ['Ciencia Ficción'],
  },
  {
    name: 'Modernidad líquida',
    author: 'Zygmunt Bauman',
    description:
      'Una reflexión profunda sobre la sociedad contemporánea, la inseguridad y la velocidad que transforman la identidad individual.',
    sellingPrice: 90,
    costPrice: 55,
    releaseDate: '2000-01-01',
    image: 'modernidad-liquida.webp',
    categories: ['Filosofía', 'Pensamiento Crítico'],
  },
  {
    name: 'La Agonía del Eros',
    author: 'Byung-Chul Han',
    description: 'Un ensayo que analiza la crisis del deseo, la intimidad y el sentido del amor en la modernidad.',
    sellingPrice: 85,
    costPrice: 50,
    releaseDate: '2012-01-01',
    image: 'agonia-del-eros.webp',
    categories: ['Filosofía', 'Pensamiento Crítico'],
  },
  {
    name: 'Orgullo y Prejuicio',
    author: 'Jane Austen',
    description:
      'Una historia de amor, orgullo y prejuicios que revela la complejidad de las relaciones humanas y la sociedad inglesa.',
    sellingPrice: 75,
    costPrice: 45,
    releaseDate: '1813-01-28',
    image: 'pride-prejudice.jpg',
    categories: ['Clásicos', 'Romance'],
  },
  {
    name: 'No Cosas',
    author: 'Byung-Chul Han',
    description:
      'Un libro que cuestiona la obsesión por acumular objetos y propone una vida más consciente, simple y auténtica.',
    sellingPrice: 70,
    costPrice: 40,
    releaseDate: '2021-01-01',
    image: 'no-cosas.webp',
    categories: ['Filosofía', 'Pensamiento Crítico'],
  },
  {
    name: 'El sublime objeto de la ideología',
    author: 'Slavoj Žižek',
    description:
      'Su obra más famosa y una puerta de entrada clásica: combina marxismo, psicoanálisis lacaniano y crítica cultural para explicar cómo la ideología funciona como una fantasía inconsciente que estructura nuestra realidad.',
    sellingPrice: 130,
    costPrice: 80,
    releaseDate: '1989-01-01',
    image: 'ideologia.jpeg',
    categories: ['Filosofía', 'Pensamiento Crítico'],
  },
  {
    name: 'Sobre la violencia',
    author: 'Slavoj Žižek',
    description:
      'Un libro breve y potente donde distingue entre violencia "subjetiva" y violencia "objetiva" o sistémica, clave para entender su crítica política contemporánea.',
    sellingPrice: 115,
    costPrice: 70,
    releaseDate: '2008-01-01',
    image: 'violencia.jpg',
    categories: ['Filosofía', 'Política'],
  },
  {
    name: 'El extranjero',
    author: 'Albert Camus',
    description:
      'Narra la historia de Meursault, un hombre indiferente emocionalmente que comete un crimen impulsivo en Argelia y enfrenta las consecuencias en un juicio donde lo condenan tanto por sus actos como por no llorar la muerte de su madre.',
    sellingPrice: 140,
    costPrice: 85,
    releaseDate: '1942-01-01',
    image: 'extranjero.webp',
    categories: ['Clásicos', 'Pensamiento Crítico'],
  },
]

async function main() {
  const sourceDir = join(__dirname, 'seed-assets', 'books')
  const uploadsDir = join(__dirname, '..', 'uploads', 'books')
  await mkdir(uploadsDir, { recursive: true })

  const categoryIdByName = new Map<string, string>()
  for (const name of CATEGORY_NAMES) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    categoryIdByName.set(name, category.id)
  }

  let createdCount = 0
  for (const book of BOOKS) {
    await copyFile(join(sourceDir, book.image), join(uploadsDir, book.image))

    const existing = await prisma.book.findFirst({ where: { name: book.name } })
    if (existing) continue

    await prisma.book.create({
      data: {
        name: book.name,
        author: book.author,
        description: book.description,
        sellingPrice: book.sellingPrice,
        costPrice: book.costPrice,
        releaseDate: new Date(book.releaseDate),
        status: 'PUBLISHED',
        coverImage: `/uploads/books/${book.image}`,
        categories: {
          connect: book.categories.map((name) => ({ id: categoryIdByName.get(name) })),
        },
      },
    })
    createdCount += 1
  }

  console.log(`Carga inicial completa: ${categoryIdByName.size} categorías aseguradas, ${createdCount} libros creados.`)

  await seedStockAndSales()
}

async function seedStockAndSales() {
  const existingSalesCount = await prisma.sale.count()
  if (existingSalesCount > 0) {
    console.log('Los datos de ventas ya fueron cargados, omitiendo.')
    return
  }

  const books = await prisma.book.findMany()

  for (const book of books) {
    await prisma.stockMovement.create({
      data: { bookId: book.id, quantity: INITIAL_STOCK_PER_BOOK, type: 'RESTOCK', note: 'Stock inicial (seed)' },
    })
  }

  let salesCreated = 0
  const now = Date.now()

  for (const book of books) {
    const salesForBook = 1 + Math.floor(Math.random() * MAX_SALES_PER_BOOK)

    for (let i = 0; i < salesForBook; i++) {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)]
      const daysAgo = Math.floor(Math.random() * 90)
      const soldAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000)

      const sale = await prisma.sale.create({
        data: { city, revenue: book.sellingPrice, bookId: book.id, soldAt },
      })

      await prisma.stockMovement.create({
        data: { bookId: book.id, quantity: -1, type: 'SALE', saleId: sale.id },
      })

      salesCreated += 1
    }
  }

  console.log(
    `Se cargaron ${INITIAL_STOCK_PER_BOOK} unidades de stock inicial para ${books.length} libros y ${salesCreated} ventas.`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
