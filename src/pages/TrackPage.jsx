import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, Calendar, AlertCircle } from 'lucide-react';
import { getComplaintById, sendFollowUp } from '../services/complaintService';
import { PrioritySignal } from '../components/complaint/PrioritySignal';
import { StatusTimeline } from '../components/complaint/StatusTimeline';
import { FollowUp } from '../components/complaint/FollowUp';
import { MapView } from '../components/map/MapView';
import { LoadingState } from '../components/ui/LoadingState';
import { useLanguage } from '../context/LanguageContext';

export const TrackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [searchId, setSearchId] = useState(id || 'CR-1048');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullAddress, setShowFullAddress] = useState(false);

  const formatSimpleAddress = (fullAddress) => {
    if (!fullAddress) return '';
    const parts = fullAddress.split(',').map(p => p.trim());
    if (parts.length <= 4) return fullAddress;
    const pincode = parts.find(p => /^\d{6}$/.test(p)) || '';
    const mainParts = parts.slice(0, 3).join(', ');
    return pincode ? `${mainParts} - ${pincode}` : mainParts;
  };

  const fetchComplaint = async (targetId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComplaintById(targetId);
      setComplaint(data);
    } catch (err) {
      console.error(err);
      setError(`${t('track.notFoundDesc')} "${targetId}". ${t('track.checkRetry')}`);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const target = id || 'CR-1048';
    setSearchId(target);
    fetchComplaint(target);
  }, [id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/track/${searchId.trim()}`);
    }
  };

  const handleSendFollowUp = async (complaintId, message) => {
    const updated = await sendFollowUp(complaintId, message);
    setComplaint(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Search Bar */}
      <div className="rounded-lg border border-[#DDE1E7] bg-white p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('track.searchPlaceholder')}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#DDE1E7] rounded-lg font-mono text-[#14213D] uppercase focus-visible:ring-2 focus-visible:ring-[#E8963C]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#14213D] text-white text-sm font-medium rounded-lg hover:bg-[#1f3057] whitespace-nowrap cursor-pointer"
          >
            {t('track.trackBtn')}
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingState message={t('track.loading')} />
      ) : error ? (
        <div className="rounded-lg border border-[#DDE1E7] bg-white p-8 text-center shadow-sm space-y-4">
          <AlertCircle className="w-10 h-10 text-[#E8963C] mx-auto" />
          <h3 className="text-xl font-bold font-heading text-[#14213D]">{t('track.notFoundTitle')}</h3>
          <p className="text-sm font-sans text-gray-600 max-w-md mx-auto">{error}</p>
        </div>
      ) : complaint ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Main Complaint Header Card */}
          <div className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm space-y-6">
            {/* Top Identity & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE1E7]">
              <div>
                <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-1">
                  {t('track.complaintLabel')}{complaint.id}
                </span>
                <h1 className="text-2xl font-bold font-heading text-[#14213D]">
                  {complaint.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <PrioritySignal priority={complaint.priority} />
                <span className="px-2.5 py-0.5 bg-[#14213D]/10 text-[#14213D] border border-[#14213D]/20 font-sans text-[11px] font-semibold uppercase tracking-[0.05em] rounded">
                  {complaint.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-1">{t('track.departmentLabel')}</span>
                  <span className="text-sm font-semibold font-sans text-[#14213D]">
                    {complaint.department_name}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E8963C] mt-1 shrink-0" />
                <div>
                  <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-1">{t('track.locationLabel')}</span>
                  <div className="text-sm font-semibold font-sans text-[#14213D]">
                    {showFullAddress ? complaint.location : formatSimpleAddress(complaint.location)}
                  </div>
                  {complaint.location && complaint.location.split(',').length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowFullAddress(!showFullAddress)}
                      className="text-[11px] text-[#C49A45] hover:underline font-semibold mt-1 cursor-pointer"
                    >
                      {showFullAddress ? t('track.hideFull') : t('track.viewFull')}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-1">{t('track.loggedOnLabel')}</span>
                  <span className="text-sm font-sans font-medium text-[#14213D]">
                    {new Date(complaint.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 pt-4 border-t border-[#DDE1E7]">
              <div>
                <span className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] block mb-1">
                  {t('track.citizenReportLabel')}
                </span>
                <p className="text-sm text-gray-700 font-sans leading-relaxed">
                  {complaint.description}
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline Card */}
          <div className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm">
            <StatusTimeline timeline={complaint.timeline} currentStatus={complaint.status} />
          </div>

          {/* Follow Up Component */}
          <FollowUp complaint={complaint} onSendFollowUp={handleSendFollowUp} />

            {/* Contact Department / Emergency Desk */}
            <div className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm space-y-4">
              <div>
                <h4 className="text-base font-semibold font-heading text-[#14213D] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C49A45]" />
                  {t('track.contactDept')}
                </h4>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  {t('track.contactDesc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="tel:1916"
                  className="p-3 bg-[#F4F5F7] hover:bg-[#e8ebf0] border border-[#DDE1E7] rounded-lg flex items-center gap-3 transition-colors group"
                >
                  <div className="p-2 bg-white rounded-md text-[#14213D] group-hover:text-[#C49A45] shadow-sm">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block font-semibold">Toll-Free Helpline</span>
                    <span className="text-sm font-bold text-[#14213D]">1916 / 1800-222</span>
                  </div>
                </a>

                <a
                  href="tel:1070"
                  className="p-3 bg-[#F4F5F7] hover:bg-[#e8ebf0] border border-[#DDE1E7] rounded-lg flex items-center gap-3 transition-colors group"
                >
                  <div className="p-2 bg-white rounded-md text-[#D64545] shadow-sm">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#D64545] uppercase block font-semibold">Emergency Desk</span>
                    <span className="text-sm font-bold text-[#14213D]">1070 (24x7)</span>
                  </div>
                </a>

                <a
                  href="mailto:support@civicreport.gov.in"
                  className="p-3 bg-[#F4F5F7] hover:bg-[#e8ebf0] border border-[#DDE1E7] rounded-lg flex items-center gap-3 transition-colors group"
                >
                  <div className="p-2 bg-white rounded-md text-[#14213D] group-hover:text-[#C49A45] shadow-sm">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block font-semibold">Official Email</span>
                    <span className="text-xs font-bold text-[#14213D] truncate block">support@civicreport.gov.in</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Location Map Snapshot */}
            <div className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm space-y-3">
              <h4 className="text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] mb-1">
                {t('track.locationMapLabel')}
              </h4>
              <MapView complaints={[complaint]} center={[complaint.coordinates?.lat || 20.5937, complaint.coordinates?.lng || 78.9629]} zoom={14} height="280px" />
              <p className="text-xs text-gray-500 italic mt-2 text-center">
                {t('track.mapCentered')}
              </p>
            </div>
        </motion.div>
      ) : null}
    </div>
  );
};
