import React, { useEffect, useState } from 'react';
import { getComplaints, updateComplaintStatus } from '../services/complaintService';
import { StatsCards } from '../components/dashboard/StatsCards';
import { FilterBar } from '../components/dashboard/FilterBar';
import { ComplaintTable } from '../components/dashboard/ComplaintTable';
import { ComplaintDetail } from '../components/dashboard/ComplaintDetail';
import { Analytics } from '../components/dashboard/Analytics';
import { CivicNewsFeed } from '../components/dashboard/CivicNewsFeed';
import { LoadingState } from '../components/ui/LoadingState';
import { ShieldCheck, Radio } from 'lucide-react';

export const DashboardPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    department_id: 'all',
    needsReviewOnly: false
  });

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const allData = await getComplaints({});
      setAllComplaints(allData);

      const filteredData = await getComplaints(filters);
      setComplaints(filteredData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const handleUpdateStatus = async (id, newStatus) => {
    const updated = await updateComplaintStatus(id, newStatus);
    setAllComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setSelectedComplaint(updated);
  };

  const stats = {
    total: allComplaints.length,
    high: allComplaints.filter((c) => c.priority === 'High').length,
    needsReview: allComplaints.filter((c) => c.evidence_score >= 30 && c.evidence_score < 70).length,
    inProgress: allComplaints.filter((c) => c.status === 'In Progress').length,
    resolved: allComplaints.filter((c) => c.status === 'Resolved').length
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE1E7] pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#C49A45] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C49A45]" />
            MUNICIPAL AUTHORITY COMMAND DESK (OFFICER CONTROL)
          </span>
          <h1 className="text-3xl font-bold font-heading text-[#14213D]">
            Control Center & Dispatch
          </h1>
          <p className="text-xs text-gray-600 font-sans mt-0.5">
            Officer-only operational portal to review AI evidence ratings, inspect fraud flags, and dispatch engineering crews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 bg-[#14213D] text-white rounded font-bold border border-[#C49A45]">
            MUNICIPAL OFFICER MODE ACTIVE
          </span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <StatsCards stats={stats} />

      {/* Live Civic Emergency & Road Hazard News Feed */}
      <CivicNewsFeed />

      {/* Filter Control Bar */}
      <FilterBar filters={filters} onFilterChange={setFilters} />

      {/* Main Operational Complaint Table with Staff Fraud Badges */}
      {loading ? (
        <LoadingState message="Loading municipal operational dispatch queue..." />
      ) : (
        <ComplaintTable
          complaints={complaints}
          onSelectComplaint={(item) => {
            setSelectedComplaint(item);
            setIsDrawerOpen(true);
          }}
        />
      )}

      {/* Analytics Section */}
      <div className="pt-4 border-t border-[#DDE1E7]">
        <h3 className="text-xl font-bold font-heading text-[#14213D] mb-4">
          Municipal Operations Analytics
        </h3>
        <Analytics complaints={allComplaints} />
      </div>

      {/* Staff Complaint Detail Drawer */}
      <ComplaintDetail
        complaint={selectedComplaint}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
