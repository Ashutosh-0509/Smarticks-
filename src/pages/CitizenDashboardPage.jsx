import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FilePlus, ClipboardCheck, ShieldCheck, MessageCircle, FileText, MapPin, Building2, Droplets, Zap, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getComplaints } from '../services/complaintService';
import { PrioritySignal } from '../components/complaint/PrioritySignal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useLanguage } from '../context/LanguageContext';

export const CitizenDashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

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

  const filteredComplaints = filterStatus === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === filterStatus);

  const getDepartmentIcon = (deptName) => {
    const name = (deptName || '').toLowerCase();
    if (name.includes('water')) return <Droplets className="w-3.5 h-3.5" />;
    if (name.includes('elect')) return <Zap className="w-3.5 h-3.5" />;
    if (name.includes('sanit') || name.includes('waste')) return <Trash2 className="w-3.5 h-3.5" />;
    return <Building2 className="w-3.5 h-3.5" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE1E7]">
          <div>
            <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-1">
              {t('citizen.badge')}
            </span>
            <h1 className="text-2xl font-bold font-heading text-[#14213D]">
              {user ? (
                `${t('citizen.welcome')} ${user.name || user.firstName || user.email || user.phone || 'Citizen'}`
              ) : (
                <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mt-1"></div>
              )}
            </h1>
            <p className="text-xs text-gray-600 font-sans mt-0.5">
              {t('citizen.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/report">
              <Button variant="accent" size="sm" className="flex items-center gap-1.5 font-bold cursor-pointer">
                <FilePlus className="w-4 h-4" />
                {t('citizen.reportIssue')}
              </Button>
            </Link>
          </div>
        </div>

        {/* User Info & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-[#DDE1E7] shadow-sm">
            <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8963C]" />
              {t('citizen.authLabel')}
            </span>
            <span className="text-[16px] font-semibold text-[#14213D]">
              {user?.phone ? `Verified (+91 ${user.phone})` : t('citizen.verified')}
            </span>
          </div>
          <div className="p-4 bg-white rounded-lg border border-[#DDE1E7] shadow-sm">
            <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] flex items-center gap-1.5 mb-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#E8963C]" />
              {t('citizen.smsLabel')}
            </span>
            <span className="text-[16px] font-semibold text-[#4A9B6E]">{t('citizen.active')}</span>
          </div>
          <div className="p-4 bg-white rounded-lg border border-[#DDE1E7] shadow-sm">
            <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-[#E8963C]" />
              {t('citizen.activeReportsLabel')}
            </span>
            <span className="text-[16px] font-semibold text-[#14213D]">{complaints.length} {t('citizen.logged')}</span>
          </div>
        </div>
      </div>

      {/* Reported Complaints List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-heading text-[#14213D]">
              {t('citizen.myComplaints')}
            </h3>
            <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] bg-gray-100 px-2 py-0.5 rounded">
              {complaints.length} {t('citizen.total')}
            </span>
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm font-sans text-[#14213D] bg-white border border-[#DDE1E7] rounded px-3 py-1.5 focus:ring-1 focus:ring-[#E8963C] outline-none shadow-sm cursor-pointer"
          >
            <option value="all">{t('citizen.allStatuses')}</option>
            <option value="Submitted">Submitted</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-lg border border-[#DDE1E7] bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <EmptyState
            title={t('citizen.noComplaints')}
            description={complaints.length === 0 ? t('citizen.noComplaintsFirst') : t('citizen.noMatchFilter')}
            action={
              complaints.length === 0 ? (
                <Link to="/report">
                  <Button variant="primary" size="md" className="flex items-center gap-2 cursor-pointer">
                    <FilePlus className="w-4 h-4 text-[#E8963C]" />
                    {t('citizen.reportFirst')}
                  </Button>
                </Link>
              ) : null
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/track/${item.id}`)}
                className="rounded-lg border border-[#DDE1E7] bg-white p-5 shadow-sm hover:border-[#E8963C] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-semibold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded border border-[#DDE1E7]">
                      {item.id}
                    </span>
                    <PrioritySignal priority={item.priority} />
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.05em] px-2.5 py-0.5 rounded bg-gray-100 text-gray-700">
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold font-heading text-[#14213D] group-hover:text-[#E8963C] transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-600 font-sans line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-sans pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> 
                      <span className="line-clamp-1">{item.location}</span>
                    </span>
                    {item.created_at && (
                      <span className="flex items-center gap-1 text-gray-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-medium bg-gray-50 px-2 py-0.5 rounded">
                      {getDepartmentIcon(item.department_name)}
                      {item.department_name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center self-start sm:self-center mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 border-gray-200 group-hover:border-[#E8963C] group-hover:text-[#E8963C] cursor-pointer">
                    <ClipboardCheck className="w-4 h-4" />
                    {t('citizen.trackProgress')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
