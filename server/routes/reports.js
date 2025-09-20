const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate financial report
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { type, period } = req.body;

    if (!type || !period) {
      return res.status(400).json({ error: 'Type and period are required' });
    }

    if (!['monthly', 'yearly'].includes(type)) {
      return res.status(400).json({ error: 'Type must be monthly or yearly' });
    }

    // Calculate date range based on period
    let startDate, endDate;
    if (type === 'monthly') {
      const [year, month] = period.split('-');
      startDate = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      endDate = `${year}-${month}-${lastDay}`;
    } else {
      startDate = `${period}-01-01`;
      endDate = `${period}-12-31`;
    }

    // Get transactions for the period
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories (
          id,
          name,
          color,
          icon,
          type
        )
      `)
      .eq('user_id', req.user.id)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const netIncome = totalIncome - totalExpenses;

    // Calculate category breakdown for expenses
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const categoryId = transaction.category_id;
        if (!acc[categoryId]) {
          acc[categoryId] = {
            category: {
              id: transaction.categories.id,
              name: transaction.categories.name,
              color: transaction.categories.color,
              icon: transaction.categories.icon,
              type: transaction.categories.type
            },
            amount: 0
          };
        }
        acc[categoryId].amount += parseFloat(transaction.amount);
        return acc;
      }, {});

    const categoryBreakdown = Object.values(expensesByCategory)
      .map(item => ({
        category: item.category,
        amount: item.amount,
        percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const report = {
      id: Date.now().toString(),
      userId: req.user.id,
      type,
      period,
      totalIncome,
      totalExpenses,
      netIncome,
      categoryBreakdown,
      generatedAt: new Date().toISOString()
    };

    res.json(report);
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;