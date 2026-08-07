/**
 * Finance Calculator Utility — Member 4: Finance, Compliance & Reporting
 *
 * Performs real-time financial modeling and calculations:
 * - Revenue = Price × Customers
 * - Profit = Revenue − Expenses
 * - Break-even (Months) = Investment / Monthly Profit
 * - ROI (%) = (Monthly Profit × 12 / Initial Investment) × 100
 * - Multi-month growth projections (with compounding customer growth)
 * - Cost breakdown distribution & initial investment allocation
 */

/**
 * Format currency values cleanly into INR (₹) or USD ($).
 * Defaulting to Indian Rupees (₹) as per Member 4 specifications.
 */
export function formatCurrency(amount, currencySymbol = '₹') {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currencySymbol}0`
  const num = Math.round(Number(amount))
  return `${currencySymbol}${num.toLocaleString('en-IN')}`
}

/**
 * Parse budget strings (e.g. "₹5,00,000" or "$50,000" or "500000") into numeric value
 */
export function parseBudgetValue(budgetString) {
  if (typeof budgetString === 'number') return budgetString
  if (!budgetString) return 500000 // Default fallback ₹5,00,000

  // Extract digits
  const cleaned = String(budgetString).replace(/[^0-9.]/g, '')
  const val = parseFloat(cleaned)
  return isNaN(val) || val <= 0 ? 500000 : val
}

/**
 * Core Finance Calculations
 *
 * @param {object} params
 * @param {number} params.investment - Initial capital investment
 * @param {number} params.pricePerUnit - Price per order/service unit
 * @param {number} params.monthlyCustomers - Number of orders/customers per month
 * @param {number} params.monthlyExpenses - Fixed & variable monthly operating expenses
 * @param {number} params.employeeCount - Optional count of employees
 * @param {number} params.costPerEmployee - Average salary per employee (optional, default 25000)
 * @param {number} params.monthlyGrowthRate - Monthly customer growth rate % (e.g., 5 => 5%)
 * @param {number} params.monthsToProject - Months for forecast (default 6)
 */
export function calculateFinancials({
  investment = 500000,
  pricePerUnit = 250,
  monthlyCustomers = 800,
  monthlyExpenses = 120000,
  employeeCount = 2,
  costPerEmployee = 25000,
  monthlyGrowthRate = 8,
  monthsToProject = 6,
}) {
  const inv = Math.max(0, Number(investment) || 0)
  const price = Math.max(0, Number(pricePerUnit) || 0)
  const cust = Math.max(0, Number(monthlyCustomers) || 0)
  const baseExpenses = Math.max(0, Number(monthlyExpenses) || 0)
  const empCount = Math.max(0, Number(employeeCount) || 0)
  const salaryCost = Math.max(0, Number(costPerEmployee) || 0)

  // Total expenses include operating costs plus employee salaries (if employees specified)
  const totalExpenses = baseExpenses + (empCount * salaryCost)
  const revenue = price * cust
  const profit = revenue - totalExpenses
  const isProfitable = profit > 0

  // Break-even in months
  let breakEvenMonths = 'N/A (Loss)'
  if (profit > 0) {
    const months = Math.ceil(inv / profit)
    breakEvenMonths = `${months} ${months === 1 ? 'Month' : 'Months'}`
  } else if (profit === 0) {
    breakEvenMonths = 'Breakeven'
  }

  // ROI Percentage (Annualized)
  let roiPercentage = 0
  if (inv > 0) {
    roiPercentage = Math.round(((profit * 12) / inv) * 100)
  }

  // Monthly Projections over time with growth rate
  const projections = []
  let currentCustomers = cust
  const growthFactor = 1 + Math.max(0, Number(monthlyGrowthRate) || 0) / 100

  for (let m = 1; m <= monthsToProject; m++) {
    const mRevenue = Math.round(price * currentCustomers)
    // Scale variable expenses slightly with customer volume (e.g. 5% variable scaling)
    const mExpenses = Math.round(totalExpenses + (mRevenue * 0.05))
    const mProfit = mRevenue - mExpenses

    projections.push({
      month: `Month ${m}`,
      customers: Math.round(currentCustomers),
      revenue: mRevenue,
      expenses: mExpenses,
      profit: mProfit,
    })

    currentCustomers *= growthFactor
  }

  // Cost Distribution breakdown
  const salaryTotal = empCount * salaryCost
  const rawOperating = Math.max(0, totalExpenses - salaryTotal)

  const costDistribution = [
    { name: 'Employee Salaries', value: salaryTotal || Math.round(totalExpenses * 0.35) },
    { name: 'Marketing & CAC', value: Math.round(rawOperating * 0.3) },
    { name: 'Operations & Logistics', value: Math.round(rawOperating * 0.4) },
    { name: 'Tech & Infrastructure', value: Math.round(rawOperating * 0.15) },
    { name: 'Legal & Administrative', value: Math.round(rawOperating * 0.15) },
  ].filter(c => c.value > 0)

  // Initial Investment Allocation
  const investmentAllocation = [
    { name: 'Product/Service Development', value: Math.round(inv * 0.35) },
    { name: 'Initial Marketing & Launch', value: Math.round(inv * 0.25) },
    { name: 'Working Capital & Reserves', value: Math.round(inv * 0.20) },
    { name: 'Licenses & Registrations', value: Math.round(inv * 0.10) },
    { name: 'Equipment & Office Setup', value: Math.round(inv * 0.10) },
  ].filter(i => i.value > 0)

  return {
    investment: inv,
    pricePerUnit: price,
    monthlyCustomers: cust,
    baseExpenses,
    employeeCount: empCount,
    costPerEmployee: salaryCost,
    monthlyGrowthRate,
    revenue,
    totalExpenses,
    profit,
    isProfitable,
    breakEvenMonths,
    roiPercentage,
    projections,
    costDistribution,
    investmentAllocation,
    yearlyProjection: {
      year1: Math.round(projections[projections.length - 1]?.revenue * 12 || revenue * 12),
      year2: Math.round((projections[projections.length - 1]?.revenue * 12 || revenue * 12) * 1.6),
      year3: Math.round((projections[projections.length - 1]?.revenue * 12 || revenue * 12) * 2.8),
    },
  }
}
