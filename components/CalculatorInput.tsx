import React from 'react';
import { Button } from '@mui/material';
import { evaluate } from 'mathjs';

interface CalculatorInputProps {
  expression: string;
  onExpressionChange: (expr: string) => void;
  onCalculate: () => void;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  expression,
  onExpressionChange,
  onCalculate
}) => {
  const handleExpressionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onExpressionChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onCalculate();
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="expression" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your mathematical expression:
        </label>
        <textarea
          id="expression"
          rows={4}
          value={expression}
          onChange={handleExpressionChange}
          onKeyDown={handleKeyDown}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., sin(x), x^2 + 2x + 1, integrate(x^2, x)"
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="contained"
          size="large"
          onClick={onCalculate}
          disabled={!expression.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Calculate
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => onExpressionChange('')}
          className="flex-1"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default CalculatorInput;