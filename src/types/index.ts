export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: Category;
  date: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  category: Category;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
}

export interface Report {
  id: string;
  userId: string;
  type: 'monthly' | 'yearly';
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  categoryBreakdown: Array<{
    category: Category;
    amount: number;
    percentage: number;
  }>;
  generatedAt: string;
}