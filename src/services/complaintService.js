import { MOCK_DEPARTMENTS, MOCK_CATEGORIES } from '../data/mockComplaints';

const STORAGE_KEY = 'civic_complaints_db';

const getStoredComplaints = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading localStorage', err);
    return [];
  }
};

const saveComplaints = (complaints) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (err) {
    console.error('Error writing localStorage', err);
  }
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch complaints with optional filtering
 */
export async function getComplaints(filters = {}) {
  await delay(250);
  let result = getStoredComplaints();

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }

  if (filters.status && filters.status !== 'all') {
    result = result.filter((c) => c.status === filters.status);
  }

  if (filters.priority && filters.priority !== 'all') {
    result = result.filter((c) => c.priority === filters.priority);
  }

  if (filters.department_id && filters.department_id !== 'all') {
    result = result.filter((c) => c.department_id === filters.department_id);
  }

  if (filters.needsReviewOnly) {
    result = result.filter((c) => c.evidence_score >= 30 && c.evidence_score < 70);
  }

  return result;
}

/**
 * Get single complaint by ID
 */
export async function getComplaintById(id) {
  await delay(200);
  const db = getStoredComplaints();
  const found = db.find((c) => c.id.toUpperCase() === id.toUpperCase());
  if (!found) {
    throw new Error(`Complaint with ID ${id} not found.`);
  }
  return { ...found };
}

/**
 * AI Analysis Service Mock
 */
export async function analyzeComplaint(formData) {
  await delay(1000);

  const text = `${formData.title || ''} ${formData.description || ''}`.toLowerCase();

  let category = 'Other';
  let priority = 'Medium';
  let deptId = 'dept-general';
  let deptName = 'General Civic Services';
  let aiSummary = 'Issue analyzed from citizen report.';
  let aiReasoning = 'Categorized based on keyword matches and location safety heuristics.';
  let confidence = 0.89;
  let evidenceScore = 88;
  let evidenceFlags = [];

  if (text.includes('pothole') || text.includes('road') || text.includes('asphalt') || text.includes('crater')) {
    category = 'Pothole';
    priority = 'High';
    deptId = 'dept-roads';
    deptName = 'Roads & Infrastructure';
    aiSummary = 'Road surface damage detected. May create immediate vehicle and pedestrian hazard.';
    aiReasoning = 'High priority because unpatched road surface holes create safety hazards on active transit routes.';
    confidence = 0.94;
  } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('dump')) {
    category = 'Garbage';
    priority = 'Medium';
    deptId = 'dept-sanitation';
    deptName = 'Sanitation & Solid Waste';
    aiSummary = 'Solid waste accumulation reported in public vicinity.';
    aiReasoning = 'Medium priority assigned for scheduled sanitation truck dispatch.';
    confidence = 0.91;
  } else if (text.includes('light') || text.includes('dark') || text.includes('pole') || text.includes('lamp')) {
    category = 'Streetlight';
    priority = 'Medium';
    deptId = 'dept-electrical';
    deptName = 'Electrical & Street Lighting';
    aiSummary = 'Illumination outage reported on public roadway.';
    aiReasoning = 'Medium priority to maintain street safety and illumination standards.';
    confidence = 0.92;
  } else if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('burst')) {
    category = 'Water Leakage';
    priority = 'High';
    deptId = 'dept-water';
    deptName = 'Water Supply & Sewage';
    aiSummary = 'Pressurized pipe leakage wasting potable supply and inundating street.';
    aiReasoning = 'High priority to minimize water loss and protect sub-base integrity.';
    confidence = 0.96;
  } else if (text.includes('drain') || text.includes('sewer') || text.includes('clog') || text.includes('waterlog')) {
    category = 'Drainage';
    priority = 'High';
    deptId = 'dept-drainage';
    deptName = 'Storm Water Drainage';
    aiSummary = 'Storm drain channel obstruction preventing runoff flow.';
    aiReasoning = 'High priority assigned due to urban waterlogging and overflow risk.';
    confidence = 0.93;
  } else if (text.includes('wire') || text.includes('shock') || text.includes('cable') || text.includes('spark')) {
    category = 'Electricity';
    priority = 'High';
    deptId = 'dept-electrical';
    deptName = 'Electrical & Street Lighting';
    aiSummary = 'Potentially dangerous electrical exposure reported.';
    aiReasoning = 'High priority for urgent public safety hazard mitigation.';
    confidence = 0.95;
  }

  if (formData.hasPhotoMismatch) {
    evidenceScore = 28;
    evidenceFlags = ['Image content could not be matched to description text'];
  }

  return {
    category,
    priority,
    department_id: deptId,
    department_name: deptName,
    ai_summary: aiSummary,
    ai_reasoning: aiReasoning,
    ai_confidence: confidence,
    evidence_score: evidenceScore,
    evidence_flags: evidenceFlags,
    is_duplicate: false
  };
}

/**
 * Submit new complaint & save to localStorage database
 */
export async function submitComplaint(complaintData) {
  await delay(500);

  const db = getStoredComplaints();
  const nextIdNum = 1048 + db.length;
  const newId = `CR-${nextIdNum}`;
  const now = new Date().toISOString();

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const dept = MOCK_DEPARTMENTS.find((d) => d.id === complaintData.department_id) || {
    id: 'dept-roads',
    name: complaintData.department_name || 'Roads & Infrastructure'
  };

  const newComplaint = {
    id: newId,
    title: complaintData.title || 'Civic Issue Report',
    description: complaintData.description || '',
    category: complaintData.category || 'Other',
    priority: complaintData.priority || 'Medium',
    department_id: dept.id,
    department_name: dept.name,
    status: 'Submitted',
    location: complaintData.location || 'Sector 17, Navi Mumbai',
    coordinates: complaintData.coordinates || { lat: 19.0760, lng: 73.0033 },
    created_at: now,
    updated_at: now,
    image_url: complaintData.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
    ai_summary: complaintData.ai_summary || 'Issue reported by citizen.',
    ai_reasoning: complaintData.ai_reasoning || 'Categorized via citizen report submission.',
    ai_confidence: complaintData.ai_confidence || 0.90,
    evidence_score: complaintData.evidence_score || 85,
    evidence_flags: complaintData.evidence_flags || [],
    is_duplicate: false,
    timeline: [
      {
        status: 'Submitted',
        timestamp: `${formattedDate} · ${formattedTime}`,
        note: 'Complaint logged successfully by citizen.'
      }
    ]
  };

  db.unshift(newComplaint);
  saveComplaints(db);
  return newComplaint;
}

/**
 * Staff status update
 */
export async function updateComplaintStatus(id, newStatus) {
  await delay(350);
  const db = getStoredComplaints();
  const complaint = db.find((c) => c.id === id);
  if (!complaint) throw new Error('Complaint not found');

  complaint.status = newStatus;
  complaint.updated_at = new Date().toISOString();

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const existingStep = complaint.timeline.find((t) => t.status === newStatus);
  if (!existingStep) {
    complaint.timeline.push({
      status: newStatus,
      timestamp: `${formattedDate} · ${formattedTime}`,
      note: `Status updated to ${newStatus} by municipal authority.`
    });
  }

  saveComplaints(db);
  return { ...complaint };
}

/**
 * Send Citizen Follow-up
 */
export async function sendFollowUp(id, message) {
  await delay(400);
  const db = getStoredComplaints();
  const complaint = db.find((c) => c.id === id);
  if (!complaint) throw new Error('Complaint not found');

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  complaint.timeline.push({
    status: complaint.status,
    timestamp: `${formattedDate} · ${formattedTime}`,
    note: `Citizen Follow-up sent: "${message}"`
  });

  saveComplaints(db);
  return { ...complaint };
}

/**
 * Mock image upload
 */
export async function uploadComplaintImage(file) {
  await delay(300);
  if (file && typeof file !== 'string') {
    return URL.createObjectURL(file);
  }
  return 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800';
}
