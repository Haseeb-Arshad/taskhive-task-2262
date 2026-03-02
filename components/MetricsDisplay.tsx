import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';

interface MetricsDisplayProps {
  calculations: any[];
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ calculations }) => {
  const { 
    calculationCount, 
    averageCalculationTime, 
    memoryUsage, 
    errorRate,
    mostUsedFunctions
  } = usePerformanceMetrics(calculations);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Calculations</p>
            <p className="text-2xl font-bold text-blue-600">{calculationCount}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Avg Time</p>
            <p className="text-2xl font-bold text-green-600">{averageCalculationTime?.toFixed(3) || 0}ms</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Memory</p>
            <p className="text-2xl font-bold text-purple-600">{memoryUsage?.toFixed(2) || 0}MB</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Error Rate</p>
            <p className="text-2xl font-bold text-red-600">{errorRate?.toFixed(1) || 0}%</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Top Functions</h3>
          <div className="space-y-2">
            {mostUsedFunctions?.slice(0, 5).map((func: any) => (
              <Badge key={func.name} className="text-sm">
                {func.name} ({func.count})
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Performance</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">
              Last calculation took {calculations[calculations.length - 1]?.duration?.toFixed(3) || 0}ms
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};