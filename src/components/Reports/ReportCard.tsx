import React from 'react';
import { Report } from '../../types';
import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';

interface ReportCardProps {
  report: Report;
}

export function ReportCard({ report }: ReportCardProps) {
  const isProfit = report.netIncome > 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {report.type} Report - {report.period}
            </h3>
            <p className="text-sm text-gray-500">
              Generated on {formatDate(report.generatedAt)}
            </p>
          </div>
        </div>
        
        <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Download</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Total Income</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">
            ${report.totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-2">
            ${report.totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className={`rounded-lg p-4 ${isProfit ? 'bg-blue-50' : 'bg-orange-50'}`}>
          <div className="flex items-center space-x-2">
            {isProfit ? (
              <TrendingUp className="h-5 w-5 text-blue-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-orange-600" />
            )}
            <span className={`text-sm font-medium ${isProfit ? 'text-blue-800' : 'text-orange-800'}`}>
              Net {isProfit ? 'Profit' : 'Loss'}
            </span>
          </div>
          <p className={`text-2xl font-bold mt-2 ${isProfit ? 'text-blue-900' : 'text-orange-900'}`}>
            ${Math.abs(report.netIncome).toFixed(2)}
          </p>
        </div>
      </div>

      {report.categoryBreakdown.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Category Breakdown</h4>
          <div className="space-y-3">
            {report.categoryBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.category.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.category.color
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                    ${item.amount.toFixed(0)}
                  </span>
                  <span className="text-xs text-gray-500 w-10 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}