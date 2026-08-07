/**
 * Finance Controller — Member 4: Finance, Compliance & Reporting
 *
 * Handles:
 *   POST /api/finance/calculate  → Server-side finance calculation (mirrors frontend utility)
 *   POST /api/finance/save       → Save finance model to a StartupProject
 *   GET  /api/finance/:projectId → Retrieve saved finance data for a project
 *
 * The frontend performs real-time calculations client-side (financeCalculator.js),
 * but these routes allow saving & retrieving persisted financial snapshots.
 */

const StartupProject = require('../models/StartupProject')
const { successResponse, errorResponse } = require('../utils/apiResponse')

// ─── Helper: Core finance calculation (mirrors frontend financeCalculator.js) ──
function calculateFinancials({
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

  const totalExpenses = baseExpenses + empCount * salaryCost
  const revenue = price * cust
  const profit = revenue - totalExpenses
  const isProfitable = profit > 0

  let breakEvenMonths = 'N/A (Loss)'
  if (profit > 0) {
    const months = Math.ceil(inv / profit)
    breakEvenMonths = `${months} ${months === 1 ? 'Month' : 'Months'}`
  } else if (profit === 0) {
    breakEvenMonths = 'Breakeven'
  }

  let roiPercentage = 0
  if (inv > 0) {
    roiPercentage = Math.round(((profit * 12) / inv) * 100)
  }

  // Financial Health Score (0–100)
  const marginRatio = revenue > 0 ? profit / revenue : 0
  const roiScore = Math.min(100, Math.max(0, roiPercentage))
  const marginScore = Math.min(100, Math.max(0, Math.round(marginRatio * 100)))
  const healthScore = Math.round((roiScore + marginScore) / 2)

  const projections = []
  let currentCustomers = cust
  const growthFactor = 1 + Math.max(0, Number(monthlyGrowthRate) || 0) / 100

  for (let m = 1; m <= monthsToProject; m++) {
    const mRevenue = Math.round(price * currentCustomers)
    const mExpenses = Math.round(totalExpenses + mRevenue * 0.05)
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

  const salaryTotal = empCount * salaryCost
  const rawOperating = Math.max(0, totalExpenses - salaryTotal)

  const costDistribution = [
    { name: 'Employee Salaries', value: salaryTotal || Math.round(totalExpenses * 0.35) },
    { name: 'Marketing & CAC', value: Math.round(rawOperating * 0.3) },
    { name: 'Operations & Logistics', value: Math.round(rawOperating * 0.4) },
    { name: 'Tech & Infrastructure', value: Math.round(rawOperating * 0.15) },
    { name: 'Legal & Administrative', value: Math.round(rawOperating * 0.15) },
  ].filter((c) => c.value > 0)

  const investmentAllocation = [
    { name: 'Product/Service Development', value: Math.round(inv * 0.35) },
    { name: 'Initial Marketing & Launch', value: Math.round(inv * 0.25) },
    { name: 'Working Capital & Reserves', value: Math.round(inv * 0.2) },
    { name: 'Licenses & Registrations', value: Math.round(inv * 0.1) },
    { name: 'Equipment & Office Setup', value: Math.round(inv * 0.1) },
  ].filter((i) => i.value > 0)

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
    healthScore,
    projections,
    costDistribution,
    investmentAllocation,
    yearlyProjection: {
      year1: Math.round(
        (projections[projections.length - 1]?.revenue * 12 || revenue * 12)
      ),
      year2: Math.round(
        (projections[projections.length - 1]?.revenue * 12 || revenue * 12) * 1.6
      ),
      year3: Math.round(
        (projections[projections.length - 1]?.revenue * 12 || revenue * 12) * 2.8
      ),
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/finance/calculate
// @access  Private
// @desc    Run server-side financial calculations and return results
// ─────────────────────────────────────────────────────────────────────────────
const calculate = async (req, res, next) => {
  try {
    const inputs = req.body || {}

    // Validate required fields
    const { investment, pricePerUnit, monthlyCustomers, monthlyExpenses } = inputs
    if (
      investment === undefined ||
      pricePerUnit === undefined ||
      monthlyCustomers === undefined ||
      monthlyExpenses === undefined
    ) {
      return errorResponse(
        res,
        'Missing required fields: investment, pricePerUnit, monthlyCustomers, monthlyExpenses',
        400
      )
    }

    const result = calculateFinancials(inputs)
    return successResponse(res, 'Finance calculation completed.', result)
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/finance/save/:projectId
// @access  Private
// @desc    Save a finance model snapshot to an existing StartupProject
// ─────────────────────────────────────────────────────────────────────────────
const saveFinanceModel = async (req, res, next) => {
  try {
    const project = await StartupProject.findOne({
      _id: req.params.projectId,
      userId: req.user.id,
    })

    if (!project) {
      return errorResponse(res, 'Project not found.', 404)
    }

    const calculatedFinance = calculateFinancials(req.body || {})

    // Merge calculated finance data into project's generatedResult
    project.generatedResult = {
      ...project.generatedResult,
      finance: {
        ...(project.generatedResult?.finance || {}),
        ...calculatedFinance,
        savedAt: new Date().toISOString(),
      },
    }

    await project.save()
    return successResponse(res, 'Finance model saved successfully.', calculatedFinance)
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/finance/:projectId
// @access  Private
// @desc    Retrieve saved finance data for a specific startup project
// ─────────────────────────────────────────────────────────────────────────────
const getFinanceReport = async (req, res, next) => {
  try {
    const project = await StartupProject.findOne({
      _id: req.params.projectId,
      userId: req.user.id,
    })

    if (!project) {
      return errorResponse(res, 'Project not found.', 404)
    }

    const financeData = project.generatedResult?.finance || null

    if (!financeData) {
      return errorResponse(res, 'No finance model saved for this project yet.', 404)
    }

    return successResponse(res, 'Finance report retrieved.', financeData)
  } catch (error) {
    next(error)
  }
}

module.exports = { calculate, saveFinanceModel, getFinanceReport }
