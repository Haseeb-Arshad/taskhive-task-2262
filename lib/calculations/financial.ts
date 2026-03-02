export interface FinancialResult {
  result: number | string;
  formula: string;
  parameters: Record<string, number>;
  error?: string;
}

export class FinancialCalculator {
  static compoundInterest(principal: number, rate: number, time: number, n: number = 1): FinancialResult {
    try {
      const amount = principal * Math.pow(1 + rate / n, n * time);
      const interest = amount - principal;
      
      return {
        result: amount,
        formula: `A = P(1 + r/n)^(nt)`,
        parameters: { principal, rate, time, n, amount, interest },
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `A = P(1 + r/n)^(nt)`,
        parameters: { principal, rate, time, n },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static loanPayment(principal: number, rate: number, time: number, n: number = 12): FinancialResult {
    try {
      const monthlyRate = rate / n;
      const totalPayments = n * time;
      const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
      const totalPayment = payment * totalPayments;
      const totalInterest = totalPayment - principal;
      
      return {
        result: payment,
        formula: `PMT = P * (r/n) / (1 - (1 + r/n)^(-nt))`,
        parameters: { 
          principal, 
          rate, 
          time, 
          n, 
          monthlyRate, 
          totalPayments, 
          payment, 
          totalPayment, 
          totalInterest 
        },
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `PMT = P * (r/n) / (1 - (1 + r/n)^(-nt))`,
        parameters: { principal, rate, time, n },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static presentValue(futureValue: number, rate: number, time: number, n: number = 1): FinancialResult {
    try {
      const presentValue = futureValue / Math.pow(1 + rate / n, n * time);
      
      return {
        result: presentValue,
        formula: `PV = FV / (1 + r/n)^(nt)`,
        parameters: { futureValue, rate, time, n, presentValue },
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `PV = FV / (1 + r/n)^(nt)`,
        parameters: { futureValue, rate, time, n },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static futureValue(presentValue: number, rate: number, time: number, n: number = 1): FinancialResult {
    try {
      const futureValue = presentValue * Math.pow(1 + rate / n, n * time);
      
      return {
        result: futureValue,
        formula: `FV = PV * (1 + r/n)^(nt)`,
        parameters: { presentValue, rate, time, n, futureValue },
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `FV = PV * (1 + r/n)^(nt)`,
        parameters: { presentValue, rate, time, n },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static annuityPayment(presentValue: number, rate: number, time: number, n: number = 12): FinancialResult {
    try {
      const monthlyRate = rate / n;
      const totalPayments = n * time;
      const payment = (presentValue * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
      const totalPayment = payment * totalPayments;
      const totalInterest = totalPayment - presentValue;
      
      return {
        result: payment,
        formula: `PMT = PV * (r/n) / (1 - (1 + r/n)^(-nt))`,
        parameters: { 
          presentValue, 
          rate, 
          time, 
          n, 
          monthlyRate, 
          totalPayments, 
          payment, 
          totalPayment, 
          totalInterest 
        },
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `PMT = PV * (r/n) / (1 - (1 + r/n)^(-nt))`,
        parameters: { presentValue, rate, time, n },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static bondPrice(faceValue: number, couponRate: number, marketRate: number, time: number, n: number = 2): FinancialResult {
    try {
      const periods = n * time;
      const periodRate = marketRate / n;
      const couponPayment = faceValue * couponRate / n;
      
      let price = 0;
      for (let i = 1; i <= periods; i++) {
        price += couponPayment / Math.pow(1 + periodRate, i);
      }
      price += faceValue / Math.pow(1 + periodRate, periods);
      
      return {
        result: price,
        formula: `P = Σ(CF_t / (1+r)^t) + (FV / (1+r)^n)`,
        parameters: { 
          faceValue, 
          couponRate, 
          marketRate, 
          time, 
          n, 
          periods, 
          periodRate, 
          couponPayment, 
          price 
        },
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `P = Σ(CF_t / (1+r)^t) + (FV / (1+r)^n)`,
        parameters: { faceValue, couponRate, marketRate, time, n },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static depreciation(initialValue: number, salvageValue: number, life: number, method: 'straight-line' | 'double-declining'): FinancialResult {
    try {
      let depreciation = 0;
      let annualDepreciation = 0;
      
      switch (method) {
        case 'straight-line':
          annualDepreciation = (initialValue - salvageValue) / life;
          depreciation = annualDepreciation;
          break;
        case 'double-declining':
          const rate = 2 / life;
          depreciation = initialValue * rate;
          break;
      }
      
      return {
        result: depreciation,
        formula: method === 'straight-line' 
          ? `Annual Depreciation = (Initial - Salvage) / Life` 
          : `Depreciation = Initial * (2 / Life)`,
        parameters: { 
          initialValue, 
          salvageValue, 
          life, 
          method, 
          depreciation, 
          annualDepreciation 
        },
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: method === 'straight-line' 
          ? `Annual Depreciation = (Initial - Salvage) / Life` 
          : `Depreciation = Initial * (2 / Life)`,
        parameters: { initialValue, salvageValue, life, method },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static netPresentValue(cashFlows: number[], discountRate: number): FinancialResult {
    try {
      let npv = 0;
      cashFlows.forEach((cashFlow, index) => {
        npv += cashFlow / Math.pow(1 + discountRate, index + 1);
      });
      
      return {
        result: npv,
        formula: `NPV = Σ(CF_t / (1+r)^t)`,
        parameters: { cashFlows, discountRate, npv },
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `NPV = Σ(CF_t / (1+r)^t)`,
        parameters: { cashFlows, discountRate },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static internalRateOfReturn(cashFlows: number[]): FinancialResult {
    try {
      // Simplified IRR calculation using Newton-Raphson method
      let rate = 0.1;
      const maxIterations = 100;
      const tolerance = 0.0001;
      
      for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dnpv = 0;
        
        cashFlows.forEach((cashFlow, index) => {
          const t = index + 1;
          npv += cashFlow / Math.pow(1 + rate, t);
          dnpv -= t * cashFlow / Math.pow(1 + rate, t + 1);
        });
        
        const newRate = rate - npv / dnpv;
        
        if (Math.abs(newRate - rate) < tolerance) {
          return {
            result: newRate,
            formula: `IRR (Newton-Raphson)`,
            parameters: { cashFlows, rate: newRate },
            error: undefined
          };
        }
        
        rate = newRate;
      }
      
      return {
        result: rate,
        formula: `IRR (Newton-Raphson)`,
        parameters: { cashFlows, rate },
        error: 'Did not converge'
      };
    } catch (error) {
      return {
        result: 'Error',
        formula: `IRR (Newton-Raphson)`,
        parameters: { cashFlows },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}