import React from 'react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '12,450', change: '+12%' },
    { label: 'Active Renders', value: '34', change: '-2%' },
    { label: 'MRR', value: '$45,200', change: '+8%' },
    { label: 'AI API Calls', value: '1.2M', change: '+24%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-gray-500 mt-1">Platform overview and management.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white border rounded-lg shadow-sm font-medium hover:bg-gray-50 transition-colors">
              Export Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm font-medium hover:bg-blue-700 transition-colors">
              System Settings
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between">
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h3 className="text-lg font-medium">Recent Users</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Storage Used</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">user_{i}@example.com</td>
                  <td className="px-6 py-4">Pro</td>
                  <td className="px-6 py-4">{(i * 12.5).toFixed(1)} GB</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
