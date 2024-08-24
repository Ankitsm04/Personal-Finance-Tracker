'use client'; // Mark as client-side component

import React from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2'; // Import Bar chart from Chart.js
import 'chart.js/auto';

export default function ChartComponent() {
  const transactions = useSelector((state) => state.transactions.items);
  const monthlyBudget = useSelector((state) => state.budget.budget);

  // Helper function to format date to "YYYY-MM"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}`; // "YYYY-MM"
  };

  // Group transactions by month and calculate total income and expenses
  const monthlyData = transactions.reduce((acc, t) => {
    const month = formatDate(t.date);
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    if (t.amount > 0) {
      acc[month].income += t.amount;
    } else {
      acc[month].expenses += -t.amount; // Convert negative amount to positive
    }
    return acc;
  }, {});

  // Sort months in chronological order
  const sortedLabels = Object.keys(monthlyData).sort((a, b) => new Date(a + '-01') - new Date(b + '-01'));
  
  const incomeData = sortedLabels.map((label) => monthlyData[label].income);
  const expensesData = sortedLabels.map((label) => monthlyData[label].expenses);

  // Create chart data object
  const chartData = {
    labels: sortedLabels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(75,192,192,0.5)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: expensesData,
        backgroundColor: 'rgba(255,99,132,0.5)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      },
      {
        label: 'Monthly Budget',
        data: sortedLabels.map(() => monthlyBudget),
        backgroundColor: 'rgba(153,102,255,0.5)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ₹${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
        stacked: true,
      },
      y: {
        title: {
          display: true,
          text: 'Amount (₹)',
        },
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg chart-container">
      <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
      <div className="w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
