import {
  ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Area, AreaChart,
} from 'recharts'
import { formatCurrency } from '../../utils/financeCalculator'

// ─── Color Palette ───────────────────────────────────────────
const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

// ─── Custom Tooltip for all charts ───────────────────────────
const chartTooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontSize: '13px',
}

// ─── Revenue vs Expense Chart (Module 3) ──────────────────────
export function RevenueExpenseChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCurrency(v).replace(',000', 'k')}
        />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value) => [formatCurrency(value), undefined]}
        />
        <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="url(#revenueGrad)"
          name="Revenue"
          dot={false}
          activeDot={{ r: 5 }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2.5}
          fill="url(#expenseGrad)"
          name="Expenses"
          dot={false}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Cost Distribution Pie Chart (Module 3) ──────────────────
export function CostDistributionChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Employee Salaries', value: 50000 },
    { name: 'Marketing & CAC', value: 35000 },
    { name: 'Operations', value: 20000 },
    { name: 'Tech Infrastructure', value: 10000 },
    { name: 'Legal & Admin', value: 5000 },
  ]

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value) => [formatCurrency(value), undefined]}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ─── Investment Allocation Chart (Module 3) ─────────────────
export function InvestmentAllocationChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Product Dev (35%)', value: 175000 },
    { name: 'Marketing (25%)', value: 125000 },
    { name: 'Reserve (20%)', value: 100000 },
    { name: 'Licenses (10%)', value: 50000 },
    { name: 'Equipment (10%)', value: 50000 },
  ]

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={0}
          outerRadius={95}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[(index + 2) % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value) => [formatCurrency(value), undefined]}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ─── Profit Bar Chart (Module 3) ─────────────────────────────
export function ProfitBarChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCurrency(v).replace(',000', 'k')}
        />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value) => [formatCurrency(value), 'Net Profit']}
          cursor={{ fill: '#f8fafc' }}
        />
        <Bar
          dataKey="profit"
          fill="#10b981"
          radius={[6, 6, 0, 0]}
          name="Profit"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Growth Projection Line Chart (Module 1 — Member 4 NEW) ──
// Shows customer count and revenue growth trend over projected months
export function GrowthProjectionChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { month: 'Month 1', customers: 800,  revenue: 200000 },
    { month: 'Month 2', customers: 864,  revenue: 216000 },
    { month: 'Month 3', customers: 933,  revenue: 233250 },
    { month: 'Month 4', customers: 1008, revenue: 252000 },
    { month: 'Month 5', customers: 1088, revenue: 272000 },
    { month: 'Month 6', customers: 1175, revenue: 293750 },
  ]

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="customerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: '#6366f1' }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Customers', angle: -90, position: 'insideLeft', fill: '#6366f1', fontSize: 11 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11, fill: '#10b981' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatCurrency(v).replace(',000', 'k')}
        />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value, name) =>
            name === 'Customers'
              ? [`${value.toLocaleString()} customers`, name]
              : [formatCurrency(value), name]
          }
        />
        <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="customers"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#6366f1' }}
          activeDot={{ r: 6 }}
          name="Customers"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#10b981' }}
          activeDot={{ r: 6 }}
          name="Revenue"
          strokeDasharray="5 3"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RevenueExpenseChart
