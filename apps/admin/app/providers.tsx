'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '../contexts/AuthContext'
import { UXProvider } from '../contexts/UXContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <UXProvider>
        {children}
      </UXProvider>
    </AuthProvider>
  )
}
