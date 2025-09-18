'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// --- Atomic Data Layer ---
type MonthlySales = {
  month: string;
  sales: number;
};

type AnnualSalesData = {
  [year: number]: MonthlySales[];
};

// Mock sales data structured for the charts.
const salesData: AnnualSalesData = {
  2024: [
    { month: 'Jan', sales: 5000 },
    { month: 'Feb', sales: 7500 },
    { month: 'Mar', sales: 6200 },
    { month: 'Apr', sales: 9000 },
    { month: 'May', sales: 8100 },
    { month: 'Jun', sales: 11000 },
    { month: 'Jul', sales: 13000 },
    { month: 'Aug', sales: 12500 },
    { month: 'Sep', sales: 15000 },
    { month: 'Oct', sales: 16000 },
    { month: 'Nov', sales: 17500 },
    { month: 'Dec', sales: 20000 },
  ],
  2023: [
    { month: 'Jan', sales: 4500 },
    { month: 'Feb', sales: 6800 },
    { month: 'Mar', sales: 7000 },
    { month: 'Apr', sales: 8500 },
    { month: 'May', sales: 7800 },
    { month: 'Jun', sales: 10500 },
    { month: 'Jul', sales: 12000 },
    { month: 'Aug', sales: 11800 },
    { month: 'Sep', sales: 14000 },
    { month: 'Oct', sales: 15500 },
    { month: 'Nov', sales: 16000 },
    { month: 'Dec', sales: 19000 },
  ],
  2022: [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 6000 },
    { month: 'Mar', sales: 5500 },
    { month: 'Apr', sales: 7500 },
    { month: 'May', sales: 7000 },
    { month: 'Jun', sales: 9000 },
    { month: 'Jul', sales: 11000 },
    { month: 'Aug', sales: 10500 },
    { month: 'Sep', sales: 12500 },
    { month: 'Oct', sales: 13500 },
    { month: 'Nov', sales: 14000 },
    { month: 'Dec', sales: 16500 },
  ],
};

// Colors for the charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#AF19FF', '#FFBB28'];

// --- Reusable Chart Components ---

const ChartContainer = ({ children }: { children: React.ReactElement }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-[300px] bg-gray-100 rounded-lg animate-pulse">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  );
};

// Bar Chart Component
const BarChartComponent = ({ data, title, salesThreshold }: { data: MonthlySales[], title: string, salesThreshold: number }) => (
  <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-indigo-500 hover:shadow-2xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <ChartContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" className="text-sm text-gray-600" />
        <YAxis className="text-sm text-gray-600" />
        <Tooltip cursor={{ fill: '#f3f4f6' }} />
        <Legend />
        <Bar dataKey="sales" name="Total Sales" fill="#8884d8">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.sales >= salesThreshold ? '#4f46e5' : '#8884d8'}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  </div>
);

// Line Chart Component
const LineChartComponent = ({ data, title, salesThreshold }: { data: MonthlySales[], title: string, salesThreshold: number }) => (
  <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-indigo-500 hover:shadow-2xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <ChartContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" className="text-sm text-gray-600" />
        <YAxis className="text-sm text-gray-600" />
        <Tooltip cursor={{ fill: '#f3f4f6' }} />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          name="Total Sales"
          stroke="#82ca9d"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ChartContainer>
  </div>
);

// Pie Chart Component
const PieChartComponent = ({ data, title }: { data: MonthlySales[], title: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-indigo-500 hover:shadow-2xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="flex justify-center items-center">
      <ChartContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="sales"
            nameKey="month"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  </div>
);

// --- Main Dashboard Component ---

type ChartType = 'Bar' | 'Line' | 'Pie';

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState<keyof AnnualSalesData>(2024);
  const [chartType, setChartType] = useState<ChartType>('Bar');
  const [salesThreshold, setSalesThreshold] = useState<number>(10000);

  // Memoize the data for performance optimization
  const currentSalesData = useMemo(() => {
    return salesData[selectedYear] || [];
  }, [selectedYear]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year as keyof AnnualSalesData);
  };

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalesThreshold(Number(e.target.value) || 0);
  };

  // Conditionally render the selected chart
  const renderChart = () => {
    const title = `Sales Data - ${selectedYear}`;
    switch (chartType) {
      case 'Bar':
        return <BarChartComponent data={currentSalesData} title={title} salesThreshold={salesThreshold} />;
      case 'Line':
        return <LineChartComponent data={currentSalesData} title={title} salesThreshold={salesThreshold} />;
      case 'Pie':
        return <PieChartComponent data={currentSalesData} title={title} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Sales Performance Dashboard
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            Interactive visualization of mock sales data for 2022, 2023, and 2024.
          </p>
        </header>

        {/* Controls Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200 mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Year Selection */}
          <div className="flex flex-col items-center">
            <label className="text-gray-700 font-medium mb-2">Select Year</label>
            <div className="flex space-x-2">
              {[2024, 2023, 2022].map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedYear === year
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type Selection */}
          <div className="flex flex-col items-center">
            <label className="text-gray-700 font-medium mb-2">Select Chart</label>
            <div className="flex space-x-2">
              {['Bar', 'Line', 'Pie'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleChartTypeChange(type as ChartType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    chartType === type
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Filter Input */}
          <div className="flex flex-col items-center">
            <label htmlFor="threshold" className="text-gray-700 font-medium mb-2">
              Sales Threshold
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                id="threshold"
                value={salesThreshold}
                onChange={handleThresholdChange}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
                placeholder="e.g., 10000"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-8">
          {renderChart()}
        </div>

        {/* Placeholder for future API integration */}
        <div className="mt-12 text-center text-gray-500">
          <p>
            This dashboard uses mock data. Future versions could integrate with a real API to fetch live sales data.
          </p>
        </div>
      </div>
    </div>
  );
}
