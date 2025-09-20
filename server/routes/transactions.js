const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all transactions for user
router.get('/', authenticateToken, async (req, res) => {
  try {
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      userId: transaction.user_id,
      type: transaction.type,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      category: {
        id: transaction.categories.id,
        name: transaction.categories.name,
        color: transaction.categories.color,
        icon: transaction.categories.icon,
        type: transaction.categories.type
      },
      date: transaction.date,
      createdAt: transaction.created_at
    }));

    res.json(formattedTransactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new transaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, amount, description, categoryId, date } = req.body;

    if (!type || !amount || !description || !categoryId || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be income or expense' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    // Verify category exists and belongs to correct type
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .eq('type', type)
      .single();

    if (categoryError || !category) {
      return res.status(400).json({ error: 'Invalid category for transaction type' });
    }

    // Create transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: req.user.id,
        type,
        amount: parseFloat(amount),
        description,
        category_id: categoryId,
        date
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
      return res.status(500).json({ error: 'Failed to create transaction' });
    }

    const formattedTransaction = {
      id: transaction.id,
      userId: transaction.user_id,
      type: transaction.type,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      category: {
        id: transaction.categories.id,
        name: transaction.categories.name,
        color: transaction.categories.color,
        icon: transaction.categories.icon,
        type: transaction.categories.type
      },
      date: transaction.date,
      createdAt: transaction.created_at
    };

    res.status(201).json(formattedTransaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update transaction
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, categoryId, date } = req.body;

    // Verify transaction belongs to user
    const { data: existingTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Verify category if provided
    if (categoryId && type) {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .eq('type', type)
        .single();

      if (categoryError || !category) {
        return res.status(400).json({ error: 'Invalid category for transaction type' });
      }
    }

    // Update transaction
    const updateData = {};
    if (type) updateData.type = type;
    if (amount) updateData.amount = parseFloat(amount);
    if (description) updateData.description = description;
    if (categoryId) updateData.category_id = categoryId;
    if (date) updateData.date = date;

    const { data: transaction, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user.id)
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
      return res.status(500).json({ error: 'Failed to update transaction' });
    }

    const formattedTransaction = {
      id: transaction.id,
      userId: transaction.user_id,
      type: transaction.type,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      category: {
        id: transaction.categories.id,
        name: transaction.categories.name,
        color: transaction.categories.color,
        icon: transaction.categories.icon,
        type: transaction.categories.type
      },
      date: transaction.date,
      createdAt: transaction.created_at
    };

    res.json(formattedTransaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete transaction
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to delete transaction' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;