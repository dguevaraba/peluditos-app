'use client'

import { useEffect } from 'react'
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'

interface ToastProps {
  show: boolean
  type: 'success' | 'warning' | 'error'
  title: string
  message: string
  onClose: () => void
  duration?: number
}

const Toast = ({ show, type, title, message, onClose, duration = 4000 }: ToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!show) {
    return null
  }

  const toastStyles = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: 'text-emerald-600',
      title: 'text-gray-900',
      message: 'text-gray-700',
      iconComponent: CheckCircle
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      title: 'text-gray-900',
      message: 'text-gray-700',
      iconComponent: AlertTriangle
    },
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      icon: 'text-rose-600',
      title: 'text-gray-900',
      message: 'text-gray-700',
      iconComponent: XCircle
    }
  }

  const styles = toastStyles[type]
  const IconComponent = styles.iconComponent

  return (
    <div className={`fixed top-4 right-4 z-50 ${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 max-w-sm w-full backdrop-blur-sm`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <IconComponent size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${styles.title}`}>
            {title}
          </h4>
          {message && (
            <p className={`text-sm mt-1 ${styles.message}`}>
              {message}
            </p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast
