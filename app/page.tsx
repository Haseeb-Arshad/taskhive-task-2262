import React, { useState } from 'react';
import CalculatorInput from '@/components/CalculatorInput';
import CalculatorOutput from '@/components/CalculatorOutput';
import { evaluate } from 'mathjs';
import { Plot } from 'react-plotly.js';

export default function Home() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [plotData, setPlotData] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    try {
      const calculationResult = evaluate(expression);
      setResult(calculationResult);
      
      // Generate plot data if it's a function
      if (typeof calculationResult === 'function') {
        const xValues = Array.from({ length: 100 }, (_, i) => -10 + (i * 20) / 99);
        const yValues = xValues.map(x => calculationResult(x));
        
        setPlotData({
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines',
          marker: { color: 'blue' }
        });
      } else {
        setPlotData(null);
      }
      
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid expression');
      setResult(null);
      setPlotData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Advanced Magic Calculator
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <CalculatorInput
            expression={expression}
            onExpressionChange={setExpression}
            onCalculate={handleCalculate}
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 font-medium">Error: {error}</p>
            </div>
          )}
        </div>

        {result !== null && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <CalculatorOutput
              expression={expression}
              result={result}
              plotData={plotData}
            />
          </div>
        )}
      </div>
    </div>
  );
}