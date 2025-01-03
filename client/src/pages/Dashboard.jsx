import React from 'react';
import { FaRegChartBar, FaFileAlt, FaRegComments, FaUsers } from 'react-icons/fa';
import { Line } from 'react-chartjs-2'; // For line chart visualization
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Sample data for the line chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Months
    datasets: [
      {
        label: 'User Interactions',
        data: [200, 300, 500, 700, 800, 1000],
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Interactions Over Time',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Analytics Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Words Translated Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <div className="mr-4 p-4 bg-teal-600 text-white rounded-full">
              <FaRegChartBar size={30} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Words Translated</h3>
              <p className="text-2xl font-bold text-teal-600">10,245</p>
            </div>
          </div>

          {/* Stories Written Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <div className="mr-4 p-4 bg-purple-600 text-white rounded-full">
              <FaFileAlt size={30} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Stories Written</h3>
              <p className="text-2xl font-bold text-purple-600">125</p>
            </div>
          </div>

          {/* Chatbot Interactions Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <div className="mr-4 p-4 bg-blue-600 text-white rounded-full">
              <FaRegComments size={30} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Chatbot Interactions</h3>
              <p className="text-2xl font-bold text-blue-600">3,500</p>
            </div>
          </div>

          {/* User Engagement Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <div className="mr-4 p-4 bg-orange-600 text-white rounded-full">
              <FaUsers size={30} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">User Engagement</h3>
              <p className="text-2xl font-bold text-orange-600">5,000</p>
            </div>
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">User Interactions Over Time</h2>
          {data.datasets[0].data.length > 0 ? (
            <div style={{ height: '400px' }}>
              <Line data={data} options={options} />
            </div>
          ) : (
            <p className="text-gray-500">No data available for the chart.</p>
          )}
        </div>

        {/* Additional Metrics Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Metrics</h2>
          <p className="text-gray-500">More metrics or charts can be added here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
