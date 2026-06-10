import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateFormat(dateString: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()

  // Hitung selisih dalam satuan detik
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000)

  // Definisikan pembagian waktu dalam detik
  const units: { unit: Intl.RelativeTimeFormatUnit; amount: number }[] = [
    { unit: 'year', amount: 31536000 },
    { unit: 'month', amount: 2592000 },
    { unit: 'day', amount: 86400 },
    { unit: 'hour', amount: 3600 },
    { unit: 'minute', amount: 60 },
    { unit: 'second', amount: 1 },
  ]

  // Inisialisasi format waktu relatif bahasa Indonesia
  const rtf = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' })

  // Cari unit waktu yang cocok
  for (const { unit, amount } of units) {
    if (Math.abs(diffInSeconds) >= amount || unit === 'second') {
      const value = Math.round(diffInSeconds / amount)
      return rtf.format(value, unit)
    }
  }

  return ''
}
