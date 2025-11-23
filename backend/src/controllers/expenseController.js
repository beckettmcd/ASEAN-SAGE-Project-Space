import { Assignment, Expense, Fee, LoEEntry } from '../models/index.js';

// Get comprehensive financial data for an assignment
export const getAssignmentFinancials = async (req, res) => {
  try {
    const { id } = req.params;

    // Get assignment with related data
    const assignment = await Assignment.findByPk(id, {
      include: [
        { association: 'expenses' },
        { association: 'fees' },
        { association: 'loeEntries' },
        { association: 'consultant' }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Calculate fees from LoE entries
    const calculatedFees = [];
    if (assignment.loeEntries && assignment.loeEntries.length > 0) {
      for (const loeEntry of assignment.loeEntries) {
        const feeAmount = parseFloat(loeEntry.days) * parseFloat(assignment.dailyRate);
        calculatedFees.push({
          id: `calculated-${loeEntry.id}`,
          feeType: 'DailyRate',
          periodStart: loeEntry.entryDate,
          periodEnd: loeEntry.entryDate,
          days: loeEntry.days,
          rate: assignment.dailyRate,
          amount: feeAmount,
          description: `Daily rate for ${loeEntry.days} days - ${loeEntry.description}`,
          status: 'Approved',
          isCalculated: true
        });
      }
    }

    // Combine calculated fees with stored fees
    const allFees = [...calculatedFees, ...assignment.fees];

    // Calculate totals
    const totalFees = allFees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
    const totalExpenses = assignment.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    const grandTotal = totalFees + totalExpenses;

    // Group expenses by category
    const expensesByCategory = assignment.expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          count: 0,
          total: 0,
          expenses: []
        };
      }
      acc[category].count += 1;
      acc[category].total += parseFloat(expense.amount || 0);
      acc[category].expenses.push(expense);
      return acc;
    }, {});

    // Group fees by type
    const feesByType = allFees.reduce((acc, fee) => {
      const type = fee.feeType;
      if (!acc[type]) {
        acc[type] = {
          type,
          count: 0,
          total: 0,
          fees: []
        };
      }
      acc[type].count += 1;
      acc[type].total += parseFloat(fee.amount || 0);
      acc[type].fees.push(fee);
      return acc;
    }, {});

    // Create timeline data (monthly breakdown)
    const timelineData = [];
    const startDate = new Date(assignment.startDate);
    const endDate = new Date(assignment.endDate);
    
    // Group by month
    const monthlyData = {};
    
    // Add expenses to monthly data
    assignment.expenses.forEach(expense => {
      const month = new Date(expense.date).toISOString().substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { month, fees: 0, expenses: 0, total: 0 };
      }
      monthlyData[month].expenses += parseFloat(expense.amount || 0);
    });

    // Add fees to monthly data
    allFees.forEach(fee => {
      const month = new Date(fee.periodStart).toISOString().substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { month, fees: 0, expenses: 0, total: 0 };
      }
      monthlyData[month].fees += parseFloat(fee.amount || 0);
    });

    // Convert to array and calculate totals
    Object.values(monthlyData).forEach(data => {
      data.total = data.fees + data.expenses;
      timelineData.push(data);
    });

    // Sort by month
    timelineData.sort((a, b) => a.month.localeCompare(b.month));

    const financials = {
      assignment: {
        id: assignment.id,
        referenceNumber: assignment.referenceNumber,
        title: assignment.title,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        dailyRate: assignment.dailyRate,
        consultant: assignment.consultant
      },
      summary: {
        totalFees: parseFloat(totalFees.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        grandTotal: parseFloat(grandTotal.toFixed(2)),
        currency: 'USD'
      },
      fees: {
        total: allFees.length,
        byType: feesByType,
        list: allFees
      },
      expenses: {
        total: assignment.expenses.length,
        byCategory: expensesByCategory,
        list: assignment.expenses
      },
      timeline: timelineData
    };

    res.json(financials);
  } catch (error) {
    console.error('Error fetching assignment financials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all assignments financial summary
export const getAllAssignmentsFinancials = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        { association: 'expenses' },
        { association: 'fees' },
        { association: 'loeEntries' },
        { association: 'consultant' },
        { association: 'country' }
      ]
    });

    let totalFees = 0;
    let totalExpenses = 0;
    const assignmentsWithFinancials = [];

    for (const assignment of assignments) {
      // Calculate fees from LoE entries
      let assignmentFees = 0;
      if (assignment.loeEntries && assignment.loeEntries.length > 0) {
        assignmentFees = assignment.loeEntries.reduce((sum, loe) => 
          sum + (parseFloat(loe.days) * parseFloat(assignment.dailyRate)), 0
        );
      }
      
      // Add stored fees
      const storedFees = assignment.fees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
      assignmentFees += storedFees;

      const assignmentExpenses = assignment.expenses.reduce((sum, expense) => 
        sum + parseFloat(expense.amount || 0), 0
      );

      totalFees += assignmentFees;
      totalExpenses += assignmentExpenses;

      assignmentsWithFinancials.push({
        id: assignment.id,
        referenceNumber: assignment.referenceNumber,
        title: assignment.title,
        country: assignment.country,
        consultant: assignment.consultant,
        totalFees: parseFloat(assignmentFees.toFixed(2)),
        totalExpenses: parseFloat(assignmentExpenses.toFixed(2)),
        grandTotal: parseFloat((assignmentFees + assignmentExpenses).toFixed(2))
      });
    }

    res.json({
      summary: {
        totalFees: parseFloat(totalFees.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        grandTotal: parseFloat((totalFees + totalExpenses).toFixed(2)),
        currency: 'USD'
      },
      assignments: assignmentsWithFinancials
    });
  } catch (error) {
    console.error('Error fetching all assignments financials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
