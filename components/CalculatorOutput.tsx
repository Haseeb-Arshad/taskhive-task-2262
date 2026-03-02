import React from 'react';
import { Plot } from 'react-plotly.js';
import { evaluate } from 'mathjs';

interface CalculatorOutputProps {
  expression: string;
  result: any;
  plotData: any;
}

const CalculatorOutput: React.FC<CalculatorOutputProps> = ({
  expression,
  result,
  plotData
}) => {
  const isFunction = typeof result === 'function';
  const isComplex = result && result.re !== undefined && result.im !== undefined;
  
  const formatResult = (res: any): string => {
    if (isComplex) {
      return `${res.re} + ${res.im}i`;
    }
    if (typeof res === 'number') {
      return res.toString();
    }
    if (typeof res === 'object') {
      return JSON.stringify(res, null, 2);
    }
    return res.toString();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Calculation Result
        </h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Expression:</span>
            <code className="bg-white p-1 rounded text-sm">{expression}</code>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Result:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg">{formatResult(result)}</span>
              {isFunction && (
                <span className="text-xs text-gray-500">(function)</span>
              )}
            </div>
          </div>
        </div>

        {isFunction && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Function Analysis:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Derivative:</span>
                <code className="ml-2">{evaluate(`derivative(${expression}, x)`)}</code>
              </div>
              <div>
                <span className="text-gray-600">Integral:</span>
                <code className="ml-2">{evaluate(`integrate(${expression}, x)`)}</code>
              </div>
            </div>
          </div>
        )}
      </div>

      {plotData && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Visualization</h3>
          <Plot
            data={[plotData]}
            layout={{
              title: 'Function Plot',
              xaxis: { title: 'x' },
              yaxis: { title: 'f(x)' },
              showlegend: false,
              height: 400
            }}
            config={{ responsive: true }}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default CalculatorOutput;