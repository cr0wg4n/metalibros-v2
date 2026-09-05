import type { Book } from '../types'
import dune from '@/assets/images/books/dune.jpg'
import modernidadLiquida from '@/assets/images/books/modernidad-liquida.webp'
import agoniaDelEros from '@/assets/images/books/agonia-del-eros.webp'
import aPrideAndPrejudice from '@/assets/images/books/pride-prejudice.jpg'
import noCosas from '@/assets/images/books/no-cosas.webp'
import atomicHabits from '@/assets/images/books/atomic-habits.jpg'

export const featuredBooks: Book[] = [
  {
    id: 'dune',
    title: 'Dune',
    description:
      'Una historia épica sobre poder, destino y supervivencia en un planeta desértico donde la especia determina el futuro del universo.',
    price: 120,
    cover: dune,
    coverAlt: 'Dune, cubierta de libro',
  },
  {
    id: 'modernidad-liquida',
    title: 'Modernidad líquida',
    description:
      'Una reflexión profunda sobre la sociedad contemporánea, la inseguridad y la velocidad que transforman la identidad individual.',
    price: 90,
    cover: modernidadLiquida,
    coverAlt: 'Modernidad líquida, cubierta de libro',
  },
  {
    id: 'agonia-del-eros',
    title: 'La Agonía del Eros',
    description: 'Un ensayo que analiza la crisis del deseo, la intimidad y el sentido del amor en la modernidad.',
    price: 85,
    cover: agoniaDelEros,
    coverAlt: 'La agonía del eros, cubierta de libro',
  },
  {
    id: 'pride-and-prejudice',
    title: 'Orgullo y Prejuicio',
    description:
      'Una historia de amor, orgullo y prejuicios que revela la complejidad de las relaciones humanas y la sociedad inglesa.',
    price: 75,
    cover: aPrideAndPrejudice,
    coverAlt: 'Orgullo y Prejuicio, cubierta de libro',
  },
  {
    id: 'no-cosas',
    title: 'No Cosas',
    description:
      'Un libro que cuestiona la obsesión por acumular objetos y propone una vida más consciente, simple y auténtica.',
    price: 70,
    cover: noCosas,
    coverAlt: 'No Cosas, cubierta de libro',
  },
  {
    id: 'atomic-habits',
    title: 'Hábitos Atómicos',
    description:
      'Una guía práctica para construir mejores hábitos mediante cambios pequeños, consistentes y sostenibles en el tiempo.',
    price: 110,
    cover: atomicHabits,
    coverAlt: 'Hábitos Atómicos, cubierta de libro',
  },
]
