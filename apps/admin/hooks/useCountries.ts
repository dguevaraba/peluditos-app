import { useState, useEffect } from 'react'

interface Country {
  code: string
  name: string
  flag: string
}

interface UseCountriesReturn {
  countries: Country[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCountries(): UseCountriesReturn {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCountries = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/countries')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar países')
      }
      
      if (data.success) {
        setCountries(data.data)
      } else {
        throw new Error(data.error || 'Error al cargar países')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  return {
    countries,
    loading,
    error,
    refetch: fetchCountries
  }
}
