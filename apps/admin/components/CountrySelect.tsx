import React from 'react'

interface Country {
  code: string
  name: string
  flag: string
}

interface CountrySelectProps {
  value: string
  onChange: (value: string) => void
  countries: Country[]
  placeholder?: string
  required?: boolean
  className?: string
  disabled?: boolean
}

export default function CountrySelect({
  value,
  onChange,
  countries,
  placeholder = 'Seleccionar país',
  required = false,
  className = '',
  disabled = false
}: CountrySelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em'
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {countries.map((country) => (
          <option key={country.code} value={country.name}>
            {country.flag} {country.name}
          </option>
        ))}
      </select>
    </div>
  )
}
