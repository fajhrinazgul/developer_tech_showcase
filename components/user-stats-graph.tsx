'use client'

import { UserType } from '@/lib/types/user'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface Props {
  user: UserType
}

export function UserStatsGraph({ user }: Props) {
  const chartData = [
    { name: 'Followers', value: user.followers_count || 0 },
    { name: 'Following', value: user.following_count || 0 },
    { name: 'Projects', value: user.projects_count || 0 },
    { name: 'Comments', value: user.total_comments_received || 0 },
  ]

  return (
    // Menggunakan fixed height agar layout konsisten
    <div className="h-75 w-full font-mono">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
        >
          {/* Garis bantu tipis untuk feel "dashboard monitoring" */}
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#27272a"
          />

          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            width={100} // Memberi ruang untuk teks label
            tick={{ fill: '#a1a1aa', fontSize: 12, fontFamily: 'monospace' }}
          />

          <Tooltip
            cursor={{ fill: '#18181b' }} // Efek highlight bar saat dihover
            contentStyle={{
              backgroundColor: '#09090b',
              borderColor: '#27272a',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#f4f4f5',
            }}
            itemStyle={{ color: '#10b981' }}
          />

          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            barSize={30}
            animationDuration={1500} // Animasi masuk yang elegan
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill="#10b981" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
