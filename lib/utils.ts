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

export function stripMarkdownAndTruncate(
  markdown: string,
  maxWords: number = 40
): string {
  if (!markdown) return ''

  const plainText = markdown
    .replace(/!\[.*?\]\(.*?\)/g, '') // Hapus Gambar: ![alt](url)
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Hapus Link tapi ambil teksnya: [Teks](url) -> Teks
    .replace(/#{1,6}\s+/g, '') // Hapus Headers: #, ##, etc.
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Hapus Bold: **teks** -> teks
    .replace(/(\*|_)(.*?)\1/g, '$2') // Hapus Italic: *teks* -> teks
    .replace(/``[\s\S]*?``/g, '') // Hapus Code Blocks
    .replace(/`([^`]+)`/g, '$1') // Hapus Inline Code: `code` -> code
    .replace(/(>|\-|\*)\s+/g, '') // Hapus Blockquotes & Bullet List dashes
    .replace(/\n+/g, ' ') // Ubah baris baru menjadi spasi tunggal

  // Pecah menjadi array kata
  const words = plainText.trim().split(/\s+/)

  // Jika jumlah kata melebihi batas, potong dan beri postfix '...'
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...'
  }

  return plainText
}
