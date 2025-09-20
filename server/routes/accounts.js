const express = require('express');
const supabase = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all accounts for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at');

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch accounts' });
    }

    const formattedAccounts = accounts.map(account => ({
      id: account.id,
      userId: account.user_id,
      name: account.name,
      type: account.type,
      balance: parseFloat(account.balance),
      currency: account.currency
    }));

    res.json(formattedAccounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;