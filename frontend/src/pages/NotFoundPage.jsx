import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <p>
        This page does not exist. <Link to="/">Back to the start page</Link>
      </p>
    </>
  )
}
