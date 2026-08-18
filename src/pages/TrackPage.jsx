import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';
import { getComplaintById, sendFollowUp } from '../services/complaintService';
import { PrioritySignal } from '../components/complaint/PrioritySignal';
import { StatusTimeline } from '../components/complaint/StatusTimeline';
import { FollowUp } from '../components/complaint/FollowUp';
import { MapView } from '../components/map/MapView';
import { LoadingState } from '../components/ui/LoadingState';

export const TrackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState(id || 'CR-1048');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaint = async (targetId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComplaintById(targetId);
      setComplaint(data);
    } catch (err) {
      console.error(err);
      setError(`No complaint found with ID "${targetId}". Check the reference number and try again.`);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSearchId(id);
      fetchComplaint(id);
    }
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Search Bar */}
      <div className="rounded-lg border border-[#DDE1E7] bg-white p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Enter Complaint Reference ID (e.g. CR-1048)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#DDE1E7] rounded-lg font-mono text-[#14213D] uppercase focus-visible:ring-2 focus-visible:ring-[#E8963C]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#14213D] text-white text-sm font-medium rounded-lg hover:bg-[#1f3057] whitespace-nowrap"
          >
            Track ID
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingState message="Retrieving complaint tracking records..." />
      ) : error ? (
        <div className="rounded-lg border border-[#DDE1E7] bg-white p-8 text-center shadow-sm space-y-4">
          <AlertCircle className="w-10 h-10 text-[#E8963C] mx-auto" />
          <h3 className="text-xl font-bold font-heading text-[#14213D]">Record Not Found</h3>
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
                <span className="text-xs font-mono font-bold text-gray-500 block mb-1">
                  COMPLAINT #{complaint.id}
                </span>
                <h1 className="text-2xl font-bold font-heading text-[#14213D]">
                  {complaint.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <PrioritySignal priority={complaint.priority} />
                <span className="px-3 py-1 bg-[#14213D] text-white font-mono text-xs font-semibold rounded">
                  {complaint.status}
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <span className="text-xs font-mono text-gray-500 uppercase block">DEPARTMENT</span>
                  <span className="text-sm font-semibold font-sans text-[#14213D]">
                    {complaint.department_name}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E8963C] mt-1" />
                <div>
                  <span className="text-xs font-mono text-gray-500 uppercase block">LOCATION</span>
                  <span className="text-sm font-semibold font-sans text-[#14213D]">
                    {complaint.location}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <span className="text-xs font-mono text-gray-500 uppercase block">LOGGED ON</span>
                  <span className="text-sm font-mono text-[#14213D]">
                    {new Date(complaint.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Description & Image */}
            <div className="space-y-3 pt-4 border-t border-[#DDE1E7]">
              <div>
                <span className="text-xs font-mono text-gray-500 uppercase block mb-1">
                  CITIZEN REPORT DESCRIPTION
                </span>
                <p className="text-sm text-gray-700 font-sans leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              {complaint.image_url && (
                <div className="w-full max-w-md h-48 rounded-lg overflow-hidden border border-[#DDE1E7] bg-[#F4F5F7] mt-3">
                  <img
                    src={complaint.image_url}
                    alt={complaint.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status Timeline Card */}
          <div className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm">
            <StatusTimeline timeline={complaint.timeline} currentStatus={complaint.status} />
          </div>

          {/* Follow Up Component */}
          <FollowUp complaint={complaint} onSendFollowUp={handleSendFollowUp} />

          {/* Location Map Snapshot */}
          <div className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm space-y-3">
            <h4 className="text-sm font-semibold font-heading text-[#14213D] uppercase tracking-wider">
              LOCATION MAP SNAPSHOT
            </h4>
            <MapView complaints={[complaint]} center={[complaint.coordinates.lat, complaint.coordinates.lng]} zoom={15} height="280px" />
          </div>
        </motion.div>
      ) : null}
    </div>
  );
};
