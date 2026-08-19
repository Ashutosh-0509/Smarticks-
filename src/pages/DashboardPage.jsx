import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      openAuthModal();
    } else if (user.role !== 'staff') {
      navigate('/');
    }
  }, [user, navigate, openAuthModal]);
  const [complaints, setComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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
    setErrorMsg(null);
    try {
      const allData = await getComplaints({});
      setAllComplaints(allData);

      const filteredData = await getComplaints(filters);
      setComplaints(filteredData);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the server. Please check your internet connection.");
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

  const handleExportCSV = () => {
    if (!complaints || complaints.length === 0) return;
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Department', 'Location', 'Date', 'Evidence Score'];
    const csvRows = [headers.join(',')];

    complaints.forEach((c) => {
      const row = [
        c.id,
        `"${(c.title || '').replace(/"/g, '""')}"`,
        `"${c.category || ''}"`,
        c.priority,
        c.status,
        `"${c.department_name || ''}"`,
        `"${(c.location || '').replace(/"/g, '""')}"`,
        new Date(c.created_at).toLocaleDateString(),
        c.evidence_score || ''
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `civic_report_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE1E7] pb-4">
        <div>
          <span className="text-[11px] font-sans font-semibold text-[#C49A45] uppercase tracking-[0.05em] flex items-center gap-1.5 mb-1">
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

      </div>

      {/* KPI Stats Bar */}
      <StatsCards stats={stats} loading={loading && allComplaints.length === 0} />

      {/* Filter Control Bar */}
      <FilterBar filters={filters} onFilterChange={setFilters} onExport={handleExportCSV} />

      {/* Main Operational Complaint Table with Staff Fraud Badges */}
      {loading && complaints.length === 0 ? (
        <LoadingState message="Loading municipal operational dispatch queue..." />
      ) : errorMsg ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200 text-center flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Network Error</span>
          <p>{errorMsg}</p>
          <button onClick={fetchDashboardData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Retry Connection
          </button>
        </div>
      ) : (
        <div className={`transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <ComplaintTable
            complaints={complaints}
            onSelectComplaint={(item) => {
              setSelectedComplaint(item);
              setIsDrawerOpen(true);
            }}
          />
        </div>
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
