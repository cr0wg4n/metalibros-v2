function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-primary/10 p-8 text-center">
      <p className="text-base font-normal text-muted">Metalibros © Todos los derechos reservados {year}</p>
    </footer>
  )
}

export default Footer
