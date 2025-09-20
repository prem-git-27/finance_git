import React, { useState } from 'react';
import { Report } from '../types';
import { FinanceAPI } from '../services/api';
import { ReportCard } from '../components/Reports/ReportCard';
import { FileText, Calendar } from 'lucide-react';

export function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  const generateReport = async (type: 'monthly' | 'yearly') => {
    setGeneratingType(type);
    setLoading(true);

    try {
      const now = new Date();
      let period: string;
      
      if (type === 'monthly') {
        period = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
        period = now.getFullYear().toString();
      }

      const report = await FinanceAPI.generateReport(type, period);
      setReports(prev => [report, ...prev]);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
      setGeneratingType(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => generateReport('monthly')}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Calendar className="h-5 w-5" />
            <span>
              {generatingType === 'monthly' ? 'Generating...' : 'Monthly Report'}
            </span>
          </button>
          <button
            onClick={() => generateReport('yearly')}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <FileText className="h-5 w-5" />
            <span>
              {generatingType === 'yearly' ? 'Generating...' : 'Yearly Report'}
            </span>
          </button>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports generated yet</h3>
          <p className="text-gray-500 mb-6">
            Generate monthly or yearly reports to get insights into your financial performance.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => generateReport('monthly')}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>Generate Monthly Report</span>
            </button>
            <button
              onClick={() => generateReport('yearly')}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Generate Yearly Report</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}