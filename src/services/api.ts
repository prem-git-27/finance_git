import { User, Transaction, Category, Budget, Account, Report } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to make authenticated requests
const makeRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMessage = typeof responseData === 'object' && responseData.error 
        ? responseData.error 
        : `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return typeof responseData === 'string' ? { message: responseData } : responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
};

export class FinanceAPI {
  // Authentication
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userData: Partial<User> & { password: string }): Promise<{ user: User; token: string }> {
    return makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async logout(): Promise<void> {
    return makeRequest('/auth/logout', {
      method: 'POST',
    });
  }

  // Transactions
  static async getTransactions(): Promise<Transaction[]> {
    return makeRequest('/transactions');
  }

  static async createTransaction(transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>): Promise<Transaction> {
    return makeRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        categoryId: transaction.category.id,
        date: transaction.date,
      }),
    });
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    return makeRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        type: updates.type,
        amount: updates.amount,
        description: updates.description,
        categoryId: updates.category?.id,
        date: updates.date,
      }),
    });
  }

  static async deleteTransaction(id: string): Promise<void> {
    return makeRequest(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    return makeRequest('/categories');
  }

  // Accounts
  static async getAccounts(): Promise<Account[]> {
    return makeRequest('/accounts');
  }

  // Budgets
  static async getBudgets(): Promise<Budget[]> {
    return makeRequest('/budgets');
  }

  static async createBudget(budget: Omit<Budget, 'id' | 'userId' | 'spent'>): Promise<Budget> {
    return makeRequest('/budgets', {
      method: 'POST',
      body: JSON.stringify({
        categoryId: budget.categoryId,
        limit: budget.limit,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
      }),
    });
  }

  // Reports
  static async generateReport(type: 'monthly' | 'yearly', period: string): Promise<Report> {
    return makeRequest('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, period }),
    });
  }
}