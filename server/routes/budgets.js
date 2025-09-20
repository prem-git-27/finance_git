const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all budgets for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: budgets, error } = await supabase
      .from('budgets')
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch budgets' });
    }

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const { data: transactions, error: transError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', req.user.id)
          .eq('category_id', budget.category_id)
          .eq('type', 'expense')
          .gte('date', budget.start_date)
          .lte('date', budget.end_date);

        if (transError) {
          console.error('Transaction fetch error:', transError);
          return budget;
        }

        const spent = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

        return {
          id: budget.id,
          userId: budget.user_id,
          categoryId: budget.category_id,
          category: {
            id: budget.categories.id,
            name: budget.categories.name,
            color: budget.categories.color,
            icon: budget.categories.icon,
            type: budget.categories.type
          },
          limit: parseFloat(budget.limit_amount),
          spent: spent,
          period: budget.period,
          startDate: budget.start_date,
          endDate: budget.end_date
        };
      })
    );

    res.json(budgetsWithSpent);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new budget
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { categoryId, limit, period, startDate, endDate } = req.body;

    if (!categoryId || !limit || !period || !startDate || !endDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (limit <= 0) {
      return res.status(400).json({ error: 'Limit must be positive' });
    }

    if (!['monthly', 'yearly'].includes(period)) {
      return res.status(400).json({ error: 'Period must be monthly or yearly' });
    }

    // Verify category exists and is expense type
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .eq('type', 'expense')
      .single();

    if (categoryError || !category) {
      return res.status(400).json({ error: 'Invalid expense category' });
    }

    // Check if budget already exists for this category and period
    const { data: existingBudget } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('category_id', categoryId)
      .eq('period', period)
      .gte('end_date', startDate)
      .lte('start_date', endDate)
      .single();

    if (existingBudget) {
      return res.status(400).json({ error: 'Budget already exists for this category and period' });
    }

    // Create budget
    const { data: budget, error } = await supabase
      .from('budgets')
      .insert([{
        user_id: req.user.id,
        category_id: categoryId,
        limit_amount: parseFloat(limit),
        period,
        start_date: startDate,
        end_date: endDate
      }])
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
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to create budget' });
    }

    const formattedBudget = {
      id: budget.id,
      userId: budget.user_id,
      categoryId: budget.category_id,
      category: {
        id: budget.categories.id,
        name: budget.categories.name,
        color: budget.categories.color,
        icon: budget.categories.icon,
        type: budget.categories.type
      },
      limit: parseFloat(budget.limit_amount),
      spent: 0,
      period: budget.period,
      startDate: budget.start_date,
      endDate: budget.end_date
    };

    res.status(201).json(formattedBudget);
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;