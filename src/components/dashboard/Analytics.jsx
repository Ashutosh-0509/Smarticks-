import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LabelList
} from 'recharts';

const PALETTE = ['#14213D', '#E8963C', '#D64545', '#4A9B6E', '#6C7A89', '#8A99AD'];

export const Analytics = ({ complaints = [] }) => {
  // Aggregate complaints by category
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    count: categoryCounts[cat]
  }));

  // Aggregate complaints by department
  const deptCounts = complaints.reduce((acc, c) => {
    const dept = c.department_name || 'General';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const deptData = Object.keys(deptCounts).map((dept) => ({
    name: dept,
    value: deptCounts[dept]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Bar Chart */}
      <div className="rounded-lg border border-[#DDE1E7] bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-[#DDE1E7] pb-3">
          <h4 className="text-base font-semibold font-heading text-[#14213D]">
            Complaints by Category
          </h4>
          <p className="text-xs text-gray-500 font-sans">
            Distribution across civic issue categories
          </p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#6C7A89" fontSize={11} tickLine={false} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#6C7A89" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#F4F5F7' }}
                contentStyle={{
                  backgroundColor: '#14213D',
                  borderColor: '#14213D',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'Inter'
                }}
                itemStyle={{ color: '#E8963C' }}
              />
              <Bar dataKey="count" fill="#E8963C" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="count" position="top" fill="#14213D" fontSize={11} fontWeight="bold" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Distribution Chart */}
      <div className="rounded-lg border border-[#DDE1E7] bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-[#DDE1E7] pb-3">
          <h4 className="text-base font-semibold font-heading text-[#14213D]">
            Department Workload Allocation
          </h4>
          <p className="text-xs text-gray-500 font-sans">
            Active complaints routed per municipal division
          </p>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deptData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {deptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14213D',
                  borderColor: '#14213D',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold font-heading fill-[#14213D]">
                {complaints.length} Active
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-sans">
          {deptData.map((d, i) => {
            const percentage = complaints.length ? Math.round((d.value / complaints.length) * 100) : 0;
            return (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                <span className="text-gray-700 font-medium">{d.name} ({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
