import { v4 as uuidv4 } from 'uuid';

export interface CalculationHistory {
  id: string;
  timestamp: Date;
  type: 'math' | 'financial' | 'scientific';
  expression: string;
  result: string;
  variables?: Record<string, number>;
  parameters?: Record<string, number>;
  unit?: string;
  error?: string;
}

export interface HistoryOptions {
  maxEntries?: number;
  storageKey?: string;
  autoSave?: boolean;
}

export class CalculationHistoryManager {
  private maxEntries: number;
  private storageKey: string;
  private autoSave: boolean;
  private history: CalculationHistory[] = [];

  constructor(options: HistoryOptions = {}) {
    this.maxEntries = options.maxEntries || 100;
    this.storageKey = options.storageKey || 'calculation_history';
    this.autoSave = options.autoSave !== false;
    
    this.load();
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load history from localStorage:', error);
      this.history = [];
    }
  }

  private save(): void {
    if (this.autoSave) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.history));
      } catch (error) {
        console.warn('Failed to save history to localStorage:', error);
      }
    }
  }

  addEntry(entry: Omit<CalculationHistory, 'id' | 'timestamp'>): string {
    const newEntry: CalculationHistory = {
      ...entry,
      id: uuidv4(),
      timestamp: new Date()
    };

    this.history.unshift(newEntry);

    // Limit history size
    if (this.history.length > this.maxEntries) {
      this.history = this.history.slice(0, this.maxEntries);
    }

    this.save();
    return newEntry.id;
  }

  getEntries(limit?: number, offset: number = 0): CalculationHistory[] {
    const start = offset;
    const end = limit ? start + limit : this.history.length;
    return this.history.slice(start, end);
  }

  getEntryById(id: string): CalculationHistory | undefined {
    return this.history.find(entry => entry.id === id);
  }

  getEntriesByType(type: 'math' | 'financial' | 'scientific', limit?: number): CalculationHistory[] {
    const filtered = this.history.filter(entry => entry.type === type);
    return limit ? filtered.slice(0, limit) : filtered;
  }

  getEntriesByDateRange(startDate: Date, endDate: Date): CalculationHistory[] {
    return this.history.filter(entry => {
      return entry.timestamp >= startDate && entry.timestamp <= endDate;
    });
  }

  getMostFrequentExpressions(limit: number = 10): { expression: string; count: number }[] {
    const expressionMap = new Map<string, number>();
    
    this.history.forEach(entry => {
      const key = entry.expression;
      expressionMap.set(key, (expressionMap.get(key) || 0) + 1);
    });
    
    return Array.from(expressionMap.entries())
      .map(([expression, count]) => ({ expression, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  getAverageCalculationTime(): number {
    if (this.history.length === 0) return 0;
    
    // This would require timing data - for now return placeholder
    return 0;
  }

  getErrorRate(): number {
    if (this.history.length === 0) return 0;
    
    const errorCount = this.history.filter(entry => entry.error).length;
    return (errorCount / this.history.length) * 100;
  }

  clearHistory(): void {
    this.history = [];
    this.save();
  }

  removeEntry(id: string): boolean {
    const index = this.history.findIndex(entry => entry.id === id);
    if (index !== -1) {
      this.history.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  exportToCSV(): string {
    const rows = [
      'ID,Timestamp,Type,Expression,Result,Variables,Parameters,Unit,Error',
      ...this.history.map(entry => {
        const variables = entry.variables ? JSON.stringify(entry.variables) : '';
        const parameters = entry.parameters ? JSON.stringify(entry.parameters) : '';
        return `${entry.id},${entry.timestamp.toISOString()},${entry.type},${entry.expression},${entry.result},${variables},${parameters},${entry.unit || ''},${entry.error || ''}`;
      })
    ];
    
    return rows.join('\n');
  }

  exportToJSON(): string {
    return JSON.stringify(this.history, null, 2);
  }

  getStatistics(): {
    totalEntries: number;
    totalMath: number;
    totalFinancial: number;
    totalScientific: number;
    errorRate: number;
    mostFrequentExpressions: { expression: string; count: number }[];
  } {
    const totalMath = this.history.filter(e => e.type === 'math').length;
    const totalFinancial = this.history.filter(e => e.type === 'financial').length;
    const totalScientific = this.history.filter(e => e.type === 'scientific').length;
    const errorRate = this.getErrorRate();
    const mostFrequentExpressions = this.getMostFrequentExpressions(5);
    
    return {
      totalEntries: this.history.length,
      totalMath,
      totalFinancial,
      totalScientific,
      errorRate,
      mostFrequentExpressions
    };
  }

  // Search functionality
  search(query: string): CalculationHistory[] {
    const lowerQuery = query.toLowerCase();
    return this.history.filter(entry => {
      return entry.expression.toLowerCase().includes(lowerQuery) ||
             entry.result.toLowerCase().includes(lowerQuery) ||
             (entry.error && entry.error.toLowerCase().includes(lowerQuery));
    });
  }

  // Tag-based filtering (could be extended with actual tagging system)
  filterByTag(tag: string): CalculationHistory[] {
    // Simple implementation - could be enhanced with actual tags
    return this.history.filter(entry => {
      return entry.expression.toLowerCase().includes(tag.toLowerCase()) ||
             entry.result.toLowerCase().includes(tag.toLowerCase());
    });
  }

  // Export for backup/restore
  backup(): string {
    return JSON.stringify({
      version: '1.0',
      timestamp: new Date().toISOString(),
      history: this.history
    }, null, 2);
  }

  restore(backupData: string): boolean {
    try {
      const backup = JSON.parse(backupData);
      if (backup.version === '1.0' && Array.isArray(backup.history)) {
        this.history = backup.history;
        this.save();
        return true;
      }
    } catch (error) {
      console.warn('Failed to restore history:', error);
    }
    return false;
  }

  // Performance optimization: get recent entries without loading all
  getRecentEntries(count: number): CalculationHistory[] {
    return this.history.slice(0, count);
  }

  // Get entries for specific date
  getEntriesForDate(date: Date): CalculationHistory[] {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    
    return this.getEntriesByDateRange(start, end);
  }

  // Get entries for current week
  getEntriesForCurrentWeek(): CalculationHistory[] {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return this.getEntriesByDateRange(startOfWeek, endOfWeek);
  }

  // Get entries for current month
  getEntriesForCurrentMonth(): CalculationHistory[] {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return this.getEntriesByDateRange(startOfMonth, endOfMonth);
  }

  // Get entries for current year
  getEntriesForCurrentYear(): CalculationHistory[] {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    
    return this.getEntriesByDateRange(startOfYear, endOfYear);
  }

  // Get calculation trends
  getCalculationTrends(): {
    daily: number[];
    weekly: number[];
    monthly: number[];
  } {
    // This would require more sophisticated time-series analysis
    // For now, return placeholder data
    return {
      daily: Array(7).fill(0),
      weekly: Array(4).fill(0),
      monthly: Array(12).fill(0)
    };
  }
}