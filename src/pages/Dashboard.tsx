import React, { useEffect, useState } from 'react';
import { Transaction, Account } from '../types';
import { FinanceAPI } from '../services/api';
import { StatCard } from '../components/Dashboard/StatCard';
import { TransactionChart } from '../components/Dashboard/TransactionChart';
import { CategoryChart } from '../components/Dashboard/CategoryChart';
import { RecentTransactions } from '../components/Dashboard/RecentTransactions';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [transactionsData, accountsData] = await Promise.all([
        FinanceAPI.getTransactions(),
        FinanceAPI.getAccounts()
      ]);
      
      setTransactions(transactionsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  });

  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return transactionDate.getMonth() === lastMonth.getMonth() && 
           transactionDate.getFullYear() === lastMonth.getFullYear();
  });

  const lastMonthExpenses = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseChange = lastMonthExpenses > 0 
    ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value={`$${totalBalance.toFixed(2)}`}
          change="All accounts"
          changeType="neutral"
          icon={Wallet}
          color="bg-blue-500"
        />
        <StatCard
          title="This Month Income"
          value={`$${thisMonthIncome.toFixed(2)}`}
          change="Current month"
          changeType="positive"
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="This Month Expenses"
          value={`$${thisMonthExpenses.toFixed(2)}`}
          change={`${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}% from last month`}
          changeType={expenseChange > 0 ? 'negative' : 'positive'}
          icon={TrendingDown}
          color="bg-red-500"
        />
        <StatCard
          title="Net Income"
          value={`$${(thisMonthIncome - thisMonthExpenses).toFixed(2)}`}
          change="This month"
          changeType={thisMonthIncome - thisMonthExpenses >= 0 ? 'positive' : 'negative'}
          icon={DollarSign}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionChart transactions={transactions} />
        <CategoryChart transactions={transactions} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions} />
    </div>
  );
}