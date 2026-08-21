import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Building2, HardHat, MapPin, Send, Loader2 } from 'lucide-react';
import { getPotholeOfficer } from '../../services/complaintService';
import { useLanguage } from '../../context/LanguageContext';

export const PotholeOfficerCard = ({ location, coordinates, complaintTitle, complaintDescription }) => {
  const { t } = useLanguage();
  const [officer, setOfficer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getPotholeOfficer(location, coordinates)
      .then((result) => {
        if (!cancelled) setOfficer(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [location, coordinates]);

  // Build mailto link (pothole-reporter style: pre-filled complaint email)
  const buildMailtoLink = () => {
    if (!officer?.officer_email) return '#';

    const subject = encodeURIComponent(`Pothole / Road Damage Complaint — ${location || 'Location'}`);
    const body = encodeURIComponent(
`Respected Sir/Madam,

I am writing to bring to your notice a road damage issue in your ward jurisdiction.

Issue: ${complaintTitle || 'Road Damage / Pothole'}
Location: ${location || 'N/A'}
Description: ${complaintDescription || 'A pothole / road surface damage has been observed at the above location.'}

Ward: ${officer.ward_name} (${officer.ward_no})
City: ${officer.city}

This issue poses a safety hazard to commuters and pedestrians. I request immediate inspection and repair.

Thank you,
Concerned Citizen

— Sent via Smarticks Civic AI Portal`
    );

    return `mailto:${officer.officer_email}?subject=${subject}&body=${body}`;
  };

  if (!location) return null;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-card)] p-4 font-sans">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-[#E8963C]" />
          <span className="text-xs font-mono">{t('pothole.lookingUpOfficer') || 'Looking up responsible officer for this ward...'}</span>
        </div>
      </div>
    );
  }

  if (error || !officer?.found) {
    return null; // Silently fail — officer card is supplementary
  }

  return (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-card)] overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#14213D]">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#C49A45]" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            {t('pothole.responsibleOfficer') || 'Responsible Ward Officer'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded text-white">
          <MapPin className="w-3 h-3 text-[#C49A45]" />
          <span className="text-[10px] font-mono font-bold">{officer.ward_name} ({officer.ward_no})</span>
        </div>
      </div>

      {/* Officer Details */}
      <div className="p-4 space-y-3">
        {/* Officer Row */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#14213D]/5 rounded-lg flex-shrink-0">
            <User className="w-5 h-5 text-[#14213D]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--ink)] leading-tight">{officer.officer_name}</p>
            <p className="text-[11px] text-gray-500 font-mono">{officer.officer_designation}</p>
            <p className="text-[11px] text-gray-400">{officer.officer_department}</p>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a
            href={`tel:${officer.officer_phone}`}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--surface)] border border-[var(--border-color)] rounded hover:border-[#4A9B6E] hover:bg-[#4A9B6E08] transition-colors group"
          >
            <Phone className="w-3.5 h-3.5 text-[#4A9B6E] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono text-[var(--ink)] truncate">{officer.officer_phone}</span>
          </a>

          <a
            href={`mailto:${officer.officer_email}`}
            className="flex items-center gap-2 px-3 py-2 bg-[var(--surface)] border border-[var(--border-color)] rounded hover:border-[#E8963C] hover:bg-[#E8963C08] transition-colors group"
          >
            <Mail className="w-3.5 h-3.5 text-[#E8963C] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono text-[var(--ink)] truncate">{officer.officer_email}</span>
          </a>
        </div>

        {/* Contractor Row */}
        {officer.contractor_name && officer.contractor_name !== 'Municipal Contractor' && (
          <div className="flex items-start gap-3 pt-2 border-t border-[var(--border-color)]">
            <div className="p-2 bg-[#E8963C]/10 rounded-lg flex-shrink-0">
              <HardHat className="w-4 h-4 text-[#E8963C]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{t('pothole.roadContractor') || 'Road Maintenance Contractor'}</p>
              <p className="text-xs font-semibold text-[var(--ink)]">{officer.contractor_name}</p>
              {officer.contractor_contact && (
                <a href={`tel:${officer.contractor_contact}`} className="text-[11px] font-mono text-[#4A9B6E] hover:underline">
                  {officer.contractor_contact}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Draft Email Button — pothole-reporter's core UX */}
        <a
          href={buildMailtoLink()}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#14213D] hover:bg-[#0B1221] text-white text-sm font-semibold rounded transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>{t('pothole.draftEmail') || 'Draft Complaint Email to Officer'}</span>
        </a>
      </div>
    </div>
  );
};
