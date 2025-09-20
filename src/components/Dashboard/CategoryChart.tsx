import React from 'react';
import { Transaction } from '../../types';

interface CategoryChartProps {
  transactions: Transaction[];
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    const categoryName = transaction.category.name;
    acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  const chartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalExpenses) * 100
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const colors = ['#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4', '#10B981'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Expense Categories</h3>
      
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={item.category} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: colors[index]
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                ${item.amount.toFixed(0)}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {chartData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No expense data available</p>
        </div>
      )}
    </div>
  );
}