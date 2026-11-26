import { useEffect, useState } from 'react'
import { apiGet } from '../api/client'

// Skeleton home page: proves that React -> Vite proxy -> Spring Boot works.
export default function HomePage() {
  // status is 'loading', 'ok' or 'error'
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    apiGet('/api/health')
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <>
      <h1>Knit Happens</h1>
      {status === 'loading' && <p>Checking the backend...</p>}
      {status === 'ok' && <p>Backend is running.</p>}
      {status === 'error' && (
        <p className="error-message" role="alert">
          Could not reach the backend. Is it running on port 8080?
        </p>
      )}
    </>
  )
}
