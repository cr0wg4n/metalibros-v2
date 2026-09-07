export const ROUTES = {
  home: '/',
  booksPublished: '/books/published',
  booksNew: '/books/new',
  booksManage: '/books/manage',
  booksEdit: '/books/:id/edit',
  sales: '/sales',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  profile: '/profile',
} as const

export function bookEditRoute(id: string) {
  return `/books/${id}/edit`
}
