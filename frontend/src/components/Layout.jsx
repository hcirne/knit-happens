import { Link, Outlet } from 'react-router'

// Shared page frame: header with navigation, the current page (<Outlet />) and a footer.
// The links are placeholders; later phases add login state and the real pages.
export default function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" className="logo">
            Knit Happens
          </Link>
          <nav className="site-nav">
            <Link to="/">Explore</Link>
            <Link to="/projects/new">Share project</Link>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </nav>
        </div>
      </header>

      <main className="container page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">Knit Happens: a student project for knitters.</div>
      </footer>
    </>
  )
}
