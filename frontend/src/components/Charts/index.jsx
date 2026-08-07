import {
  ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Area, AreaChart,
} from 'recharts'

// ─── Color Palette ───────────────────────────────────────────
const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

// ─── Revenue vs Expense Chart ────────────────────────────────
export function RevenueExpenseChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            fontSize: '13px',
          }}
          formatter={(value) => [`$${value?.toLocaleString()}`, undefined]}
        />
        <Legend
          wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          name="Revenue"
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#expenseGrad)"
          name="Expenses"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Cost Distribution Pie ───────────────────────────────────
export function CostDistributionChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '13px',
          }}
          formatter={(value) => [`$${value?.toLocaleString()}`, undefined]}
        />
        <Legend
          wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ─── Profit Bar Chart ────────────────────────────────────────
export function ProfitBarChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '13px',
          }}
          formatter={(value) => [`$${value?.toLocaleString()}`, undefined]}
          cursor={{ fill: '#f8fafc' }}
        />
        <Bar
          dataKey="profit"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          name="Profit"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RevenueExpenseChart
