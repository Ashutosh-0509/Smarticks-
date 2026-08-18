import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, FilePlus, ClipboardCheck, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getComplaints } from '../services/complaintService';
import { PrioritySignal } from '../components/complaint/PrioritySignal';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';

export const CitizenDashboardPage = () => {
  const { user, openAuthModal } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getComplaints({});
        setComplaints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE1E7]">
          <div>
            <span className="text-xs font-mono font-bold text-[#4A9B6E] uppercase tracking-wider block">
              VERIFIED CITIZEN PORTAL
            </span>
            <h1 className="text-2xl font-bold font-heading text-[#14213D]">
              {user ? `Welcome, ${user.name}` : 'Citizen Portal'}
            </h1>
            <p className="text-xs text-gray-600 font-sans mt-0.5">
              Track your reported civic complaints and receive real-time resolution updates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/report">
              <Button variant="accent" size="sm" className="flex items-center gap-1.5 font-bold">
                <FilePlus className="w-4 h-4" />
                Report an Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* User Info & SMS Notification Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
          <div className="p-3 bg-[#F4F5F7] rounded border border-[#DDE1E7]">
            <span className="font-mono text-gray-400 block">AUTHENTICATION</span>
            <span className="font-semibold text-[#14213D]">
              {user?.phone ? `Mobile OTP Verified (+91 ${user.phone})` : 'OTP Verified'}
            </span>
          </div>
          <div className="p-3 bg-[#F4F5F7] rounded border border-[#DDE1E7]">
            <span className="font-mono text-gray-400 block">SMS DISPATCH ALERTS</span>
            <span className="font-semibold text-[#4A9B6E]">Active 🟢</span>
          </div>
          <div className="p-3 bg-[#F4F5F7] rounded border border-[#DDE1E7]">
            <span className="font-mono text-gray-400 block">ACTIVE REPORTS</span>
            <span className="font-mono font-bold text-[#14213D]">{complaints.length} Logged</span>
          </div>
        </div>
      </div>

      {/* Reported Complaints List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-heading text-[#14213D]">
            My Reported Complaints
          </h3>
          <span className="text-xs font-mono text-gray-500">
            {complaints.length} total
          </span>
        </div>

        {loading ? (
          <LoadingState message="Fetching your reported complaints..." />
        ) : complaints.length === 0 ? (
          <EmptyState
            title="No complaints reported yet."
            description="You haven't logged any civic issues yet. Click below to submit your first report to municipal dispatch."
            action={
              <Link to="/report">
                <Button variant="primary" size="md" className="flex items-center gap-2">
                  <FilePlus className="w-4 h-4 text-[#E8963C]" />
                  Report Your First Issue
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {complaints.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-[#DDE1E7] bg-white p-5 shadow-sm hover:border-[#14213D]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#14213D] bg-[#F4F5F7] px-2.5 py-0.5 rounded border border-[#DDE1E7]">
                      {item.id}
                    </span>
                    <PrioritySignal priority={item.priority} />
                    <span className="text-xs font-sans font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold font-heading text-[#14213D]">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-600 font-sans line-clamp-1">
                    {item.location} • {item.department_name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/track/${item.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ClipboardCheck className="w-4 h-4 text-[#E8963C]" />
                      Track Progress
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
