import React from 'react';
import { PrioritySignal } from '../complaint/PrioritySignal';
import { EvidenceBadge } from '../complaint/EvidenceBadge';
import { ChevronRight } from 'lucide-react';

export const ComplaintTable = ({ complaints = [], onSelectComplaint }) => {
  const formatDate = (isoStr) => {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-[#4A9B6E]/10 text-[#4A9B6E] border-[#4A9B6E]/20';
      case 'In Progress':
        return 'bg-[#14213D]/10 text-[#14213D] border-[#14213D]/20';
      case 'Assigned':
        return 'bg-[#E8963C]/10 text-[#E8963C] border-[#E8963C]/20';
      case 'Acknowledged':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="w-full rounded-lg border border-[#DDE1E7] bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F5F7] border-b border-[#DDE1E7] text-xs font-mono text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">ID</th>
              <th className="py-3 px-4 font-semibold">COMPLAINT</th>
              <th className="py-3 px-4 font-semibold">CATEGORY</th>
              <th className="py-3 px-4 font-semibold">PRIORITY</th>
              <th className="py-3 px-4 font-semibold">DEPARTMENT</th>
              <th className="py-3 px-4 font-semibold">STATUS</th>
              <th className="py-3 px-4 font-semibold">EVIDENCE</th>
              <th className="py-3 px-4 font-semibold">CREATED</th>
              <th className="py-3 px-4 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE1E7] text-sm font-sans text-[#14213D]">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-500 font-sans">
                  No complaints reported yet in this area.
                </td>
              </tr>
            ) : (
              complaints.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectComplaint(item)}
                  className="hover:bg-[#F4F5F7]/80 cursor-pointer transition-colors"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#14213D]">
                    {item.id}
                  </td>

                  {/* Title & Location */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-semibold text-[#14213D] truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 truncate">{item.location}</p>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 font-medium text-gray-700">{item.category}</td>

                  {/* Priority Signal */}
                  <td className="py-3.5 px-4">
                    <PrioritySignal priority={item.priority} />
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 text-xs font-medium text-gray-700">
                    {item.department_name}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded border text-xs font-medium ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Staff Only Evidence Badge */}
                  <td className="py-3.5 px-4">
                    <EvidenceBadge score={item.evidence_score} />
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectComplaint(item);
                      }}
                      className="p-1.5 rounded-md hover:bg-[#DDE1E7] text-[#14213D]"
                      aria-label="Inspect complaint detail"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
