import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { attendanceData } from '../../data/dashboard'

export default function AttendanceChart() {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={attendanceData}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="hari"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#64748b',
              fontSize: 12,
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#64748b',
              fontSize: 12,
            }}
          />

          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="hadir"
            name="Hadir"
            stroke="#0f172a"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: '#0f172a',
            }}
            activeDot={{
              r: 6,
            }}
          />

          <Line
            type="monotone"
            dataKey="terlambat"
            name="Terlambat"
            stroke="#475569"
            strokeWidth={2}
            dot={{
              r: 3,
              fill: '#475569',
            }}
          />

          <Line
            type="monotone"
            dataKey="izin"
            name="Izin"
            stroke="#94a3b8"
            strokeWidth={2}
            dot={{
              r: 3,
              fill: '#94a3b8',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}