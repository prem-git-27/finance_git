import React from 'react';
import { Transaction } from '../../types';

interface TransactionChartProps {
  transactions: Transaction[];
}

export function TransactionChart({ transactions }: TransactionChartProps) {
  // Simple bar chart implementation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => t.date === date);
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      date,
      income,
      expenses,
      day: new Date(date).toLocaleDateString('en', { weekday: 'short' })
    };
  });

  const maxValue = Math.max(...chartData.map(d => Math.max(d.income, d.expenses)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Overview</h3>
      
      <div className="flex items-end space-x-2 h-64">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div className="flex flex-col items-center space-y-1 h-48 justify-end">
              {data.income > 0 && (
                <div 
                  className="bg-green-500 rounded-t w-8 min-h-[4px]"
                  style={{ 
                    height: `${(data.income / maxValue) * 160}px` 
                  }}
                  title={`Income: $${data.income.toFixed(2)}`}
                />
              )}
              {data.expenses > 0 && (
                <div 
                  className="bg-red-500 rounded-t w-8 min-h-[4px]"
                  style={{ 
                    height: `${(data.expenses / maxValue) * 160}px` 
                  }}
                  title={`Expenses: $${data.expenses.toFixed(2)}`}
                />
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium">{data.day}</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Income</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Expenses</span>
        </div>
      </div>
    </div>
  );
}