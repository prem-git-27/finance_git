import React from 'react';
import { Budget } from '../../types';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface BudgetCardProps {
  budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const percentage = (budget.spent / budget.limit) * 100;
  const remaining = budget.limit - budget.spent;
  
  const getStatusColor = () => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBackgroundColor = () => {
    if (percentage >= 90) return 'bg-red-50';
    if (percentage >= 75) return 'bg-yellow-50';
    return 'bg-green-50';
  };

  return (
    <div className={`rounded-xl shadow-sm border border-gray-200 p-6 ${getBackgroundColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${budget.category.color}20` }}
          >
            <Target 
              className="h-5 w-5"
              style={{ color: budget.category.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{budget.category.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{budget.period} Budget</p>
          </div>
        </div>
        
        {percentage >= 90 && (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Progress</span>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {percentage.toFixed(1)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-gray-600">Spent: </span>
            <span className="font-semibold text-gray-900">${budget.spent.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">Limit: </span>
            <span className="font-semibold text-gray-900">${budget.limit.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Remaining:</span>
            <div className="flex items-center space-x-1">
              <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(remaining).toFixed(2)}
              </span>
              {remaining < 0 && (
                <span className="text-xs text-red-500">(over budget)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}