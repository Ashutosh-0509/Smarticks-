import React from 'react';
import { Search, Filter, AlertCircle, Download } from 'lucide-react';
import { MOCK_DEPARTMENTS } from '../../data/mockComplaints';

export const FilterBar = ({ filters, onFilterChange, onExport }) => {
  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-card)] p-4 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID, title, or location..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[var(--border-color)] rounded font-sans text-[var(--ink)] focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full pl-3 pr-8 py-2 text-sm bg-white border border-[var(--border-color)] rounded font-sans text-[var(--ink)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236C7A89' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '16px' }}
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
            className="w-full pl-3 pr-8 py-2 text-sm bg-white border border-[var(--border-color)] rounded font-sans text-[var(--ink)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236C7A89' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '16px' }}
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
            className="w-full pl-3 pr-8 py-2 text-sm bg-white border border-[var(--border-color)] rounded font-sans text-[var(--ink)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236C7A89' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '16px' }}
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

      {/* Staff Evidence Toggle & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[var(--border-color)] gap-3">
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-sans font-medium text-[var(--ink)]">
          <input
            type="checkbox"
            checked={!!filters.needsReviewOnly}
            onChange={(e) => onFilterChange({ ...filters, needsReviewOnly: e.target.checked })}
            className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <AlertCircle className="w-3.5 h-3.5 text-[#E8963C]" />
          <span>Show only complaints needing evidence review (Staff Only)</span>
        </label>

        <div className="flex items-center gap-4">
          {(filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.department_id !== 'all' || filters.needsReviewOnly) && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: '', status: 'all', priority: 'all', department_id: 'all', needsReviewOnly: false })}
              className="text-xs font-sans font-semibold text-[var(--accent)] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--ink)] text-white text-xs font-medium rounded hover:bg-black cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export to CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
