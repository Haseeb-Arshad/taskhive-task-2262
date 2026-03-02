import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface ExportPanelProps {
  calculations: any[];
  onExport: (format: string, data: any) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ calculations, onExport }) => {
  const [format, setFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [filename, setFilename] = useState('calculations');

  const exportData = () => {
    const exportableData = calculations.map(calc => ({
      expression: calc.expression,
      result: calc.result,
      timestamp: calc.timestamp,
      type: calc.type
    }));

    onExport(format, {
      filename: `${filename}.${format}`,
      data: exportableData
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Data Export</CardTitle>
        <CardDescription>Export calculation history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Format
            </label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filename
            </label>
            <Input 
              value={filename} 
              onChange={(e) => setFilename(e.target.value)}
              placeholder="calculations"
            />
          </div>

          <Button 
            onClick={exportData}
            className="w-full"
            disabled={calculations.length === 0}
          >
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};