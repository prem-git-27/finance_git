-- Finance Management Database Schema
-- This file contains the complete database schema for the finance management application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (predefined expense and income categories)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL, -- Hex color code
    icon VARCHAR(50) NOT NULL, -- Lucide icon name
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table (bank accounts, credit cards, etc.)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'investment')),
    balance DECIMAL(12, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    description TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    limit_amount DECIMAL(12, 2) NOT NULL CHECK (limit_amount > 0),
    period VARCHAR(10) NOT NULL CHECK (period IN ('monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id, period, start_date, end_date)
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);

-- Insert default categories
INSERT INTO categories (name, color, icon, type) VALUES
-- Expense categories
('Food & Dining', '#EF4444', 'Utensils', 'expense'),
('Transportation', '#F59E0B', 'Car', 'expense'),
('Shopping', '#8B5CF6', 'ShoppingBag', 'expense'),
('Entertainment', '#06B6D4', 'Music', 'expense'),
('Bills & Utilities', '#DC2626', 'Receipt', 'expense'),
('Healthcare', '#059669', 'Heart', 'expense'),
('Education', '#7C3AED', 'GraduationCap', 'expense'),
('Travel', '#0891B2', 'Plane', 'expense'),
('Personal Care', '#BE185D', 'Scissors', 'expense'),
('Home & Garden', '#65A30D', 'Home', 'expense'),
('Insurance', '#1F2937', 'Shield', 'expense'),
('Taxes', '#374151', 'FileText', 'expense'),
('Gifts & Donations', '#EC4899', 'Gift', 'expense'),
('Business Expenses', '#6366F1', 'Briefcase', 'expense'),
('Other Expenses', '#6B7280', 'MoreHorizontal', 'expense'),

-- Income categories
('Salary', '#10B981', 'Briefcase', 'income'),
('Freelance', '#6366F1', 'Code', 'income'),
('Business Income', '#059669', 'TrendingUp', 'income'),
('Investment Returns', '#0891B2', 'PieChart', 'income'),
('Rental Income', '#65A30D', 'Home', 'income'),
('Interest', '#7C3AED', 'Percent', 'income'),
('Dividends', '#DC2626', 'DollarSign', 'income'),
('Bonus', '#F59E0B', 'Award', 'income'),
('Refunds', '#06B6D4', 'RefreshCw', 'income'),
('Gifts Received', '#EC4899', 'Gift', 'income'),
('Other Income', '#6B7280', 'Plus', 'income');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for accounts table
CREATE POLICY "Users can manage own accounts" ON accounts
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for transactions table
CREATE POLICY "Users can manage own transactions" ON transactions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for budgets table
CREATE POLICY "Users can manage own budgets" ON budgets
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Categories are public (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read categories" ON categories
    FOR SELECT TO authenticated USING (true);