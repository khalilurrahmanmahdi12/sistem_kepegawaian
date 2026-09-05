import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { employeeStatusData } from '../../data/dashboard'

const COLORS = [
  '#0f172a',
  '#334155',
  '#94a3b8',
]

export default function EmployeeStatusChart() {
  const total = employeeStatusData.reduce(
    (jumlah, item) => jumlah + item.jumlah,
    0
  )

  return (
    <div>
      <div className="relative h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={employeeStatusData}
              dataKey="jumlah"
              nameKey="nama"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
            >
              {employeeStatusData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">
            {total}
          </span>

          <span className="text-xs text-slate-500">
            Karyawan
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {employeeStatusData.map((item, index) => (
          <div
            key={item.nama}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[index % COLORS.length],
                }}
              />

              <span className="text-slate-600">
                {item.nama}
              </span>
            </div>

            <span className="font-semibold text-slate-900">
              {item.jumlah}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}