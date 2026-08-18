import React from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { MOCK_DEPARTMENTS } from '../../data/mockComplaints';

export const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="rounded-lg border border-[#DDE1E7] bg-white p-4 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID, title, or location..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#DDE1E7] rounded-lg font-sans text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#E8963C]"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-[#DDE1E7] rounded-lg font-sans text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#E8963C]"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={filters.priority || 'all'}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-[#DDE1E7] rounded-lg font-sans text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#E8963C]"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={filters.department_id || 'all'}
            onChange={(e) => onFilterChange({ ...filters, department_id: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-[#DDE1E7] rounded-lg font-sans text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#E8963C]"
          >
            <option value="all">All Departments</option>
            {MOCK_DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Evidence Toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-[#DDE1E7]">
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-sans font-medium text-[#14213D]">
          <input
            type="checkbox"
            checked={!!filters.needsReviewOnly}
            onChange={(e) => onFilterChange({ ...filters, needsReviewOnly: e.target.checked })}
            className="w-4 h-4 rounded border-[#DDE1E7] text-[#E8963C] focus:ring-[#E8963C]"
          />
          <AlertCircle className="w-3.5 h-3.5 text-[#E8963C]" />
          <span>Show only complaints needing evidence review (Staff Only)</span>
        </label>

        {(filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.department_id !== 'all' || filters.needsReviewOnly) && (
          <button
            type="button"
            onClick={() => onFilterChange({ search: '', status: 'all', priority: 'all', department_id: 'all', needsReviewOnly: false })}
            className="text-xs font-mono text-[#E8963C] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
