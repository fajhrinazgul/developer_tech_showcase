'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }} // Animasi saat pindah halaman
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
