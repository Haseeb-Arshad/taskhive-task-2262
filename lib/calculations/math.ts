import { create, all } from 'mathjs';

const config = {};
const math = create(all, config);

export interface MathResult {
  result: number | string;
  expression: string;
  variables: Record<string, number>;
  error?: string;
}

export class MathCalculator {
  static evaluate(expression: string, variables: Record<string, number> = {}): MathResult {
    try {
      const result = math.evaluate(expression, variables);
      return {
        result,
        expression,
        variables,
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        expression,
        variables,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static derivative(expression: string, variable: string): MathResult {
    try {
      const derivative = math.derivative(expression, variable);
      return {
        result: derivative.toString(),
        expression: `d/d${variable}(${expression})`,
        variables: {},
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        expression: `d/d${variable}(${expression})`,
        variables: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static integrate(expression: string, variable: string, lower: number, upper: number): MathResult {
    try {
      const integral = math.integral(expression, variable);
      const result = integral.evaluate({ [variable]: upper }) - integral.evaluate({ [variable]: lower });
      return {
        result,
        expression: `∫_${lower}^{${upper}} ${expression} d${variable}`,
        variables: {},
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        expression: `∫_${lower}^{${upper}} ${expression} d${variable}`,
        variables: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static solveEquation(expression: string, variable: string): MathResult[] {
    try {
      const solutions = math.simplify(expression).solve(variable);
      return solutions.map((solution, index) => ({
        result: solution.toString(),
        expression: `Solve ${expression} for ${variable}`,
        variables: {},
        error: undefined
      }));
    } catch (error) {
      return [{
        result: 'Error',
        expression: `Solve ${expression} for ${variable}`,
        variables: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      }];
    }
  }

  static matrixOperations(matrix: number[][], operation: 'determinant' | 'inverse' | 'transpose'): MathResult {
    try {
      const mathMatrix = math.matrix(matrix);
      let result;
      
      switch (operation) {
        case 'determinant':
          result = math.det(mathMatrix);
          break;
        case 'inverse':
          result = math.inv(mathMatrix);
          break;
        case 'transpose':
          result = math.transpose(mathMatrix);
          break;
      }
      
      return {
        result: result.toString(),
        expression: `${operation}(${JSON.stringify(matrix)})`,
        variables: {},
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        expression: `${operation}(${JSON.stringify(matrix)})`,
        variables: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static statistics(data: number[], operation: 'mean' | 'median' | 'variance' | 'std'): MathResult {
    try {
      let result;
      
      switch (operation) {
        case 'mean':
          result = math.mean(data);
          break;
        case 'median':
          result = math.median(data);
          break;
        case 'variance':
          result = math.variance(data);
          break;
        case 'std':
          result = math.std(data);
          break;
      }
      
      return {
        result,
        expression: `${operation}(${JSON.stringify(data)})`,
        variables: {},
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        expression: `${operation}(${JSON.stringify(data)})`,
        variables: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static complexNumberOperations(a: string, b: string, operation: 'add' | 'subtract' | 'multiply' | 'divide'): MathResult {
    try {
      const complexA = math.complex(a);
      const complexB = math.complex(b);
      let result;
      
      switch (operation) {
        case 'add':
          result = math.add(complexA, complexB);
          break;
        case 'subtract':
          result = math.subtract(complexA, complexB);
          break;
        case 'multiply':
          result = math.multiply(complexA, complexB);
          break;
        case 'divide':
          result = math.divide(complexA, complexB);
          break;
      }
      
      return {
        result: result.toString(),
        expression: `${a} ${operation === 'add' ? '+' : operation === 'subtract' ? '-' : operation === 'multiply' ? '*' : '/'} ${b}`,
        variables: {},
        error: undefined
      };
    } catch (error) {
      return {
        result: 'Error',
        expression: `${a} ${operation === 'add' ? '+' : operation === 'subtract' ? '-' : operation === 'multiply' ? '*' : '/'} ${b}`,
        variables: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}