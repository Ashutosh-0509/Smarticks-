import { MOCK_DEPARTMENTS } from '../data/mockComplaints';
import { supabase } from '../lib/supabase';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch complaints with optional filtering
 */
export async function getComplaints(filters = {}) {
  let query = supabase.from('complaints').select('*').order('created_at', { ascending: false });

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority);
  }

  if (filters.department_id && filters.department_id !== 'all') {
    query = query.eq('department_id', filters.department_id);
  }

  if (filters.needsReviewOnly) {
    query = query.gte('evidence_score', 30).lt('evidence_score', 70);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching complaints:", error);
    return [];
  }

  let result = data;
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

  return result;
}

/**
 * Get single complaint by ID
 */
export async function getComplaintById(id) {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', id.toUpperCase())
    .single();

  if (error || !data) {
    throw new Error(`Complaint with ID ${id} not found.`);
  }
  return data;
}

/**
 * AI Analysis Service
 */
export async function analyzeComplaint(formData) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Gemini API call failed, falling back to local NLP logic:", error);
    
    // Fallback logic
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
}

/**
 * Submit new complaint & save to Supabase
 */
export async function submitComplaint(complaintData) {
  // Get count for ID generation
  const { count, error: countError } = await supabase
    .from('complaints')
    .select('*', { count: 'exact', head: true });
    
  const nextIdNum = 1048 + (count || 0);
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

  const { data, error } = await supabase.from('complaints').insert([newComplaint]).select().single();
  if (error) {
    console.error("Insert error:", error);
    throw new Error('Failed to submit complaint to database');
  }

  return data;
}

/**
 * Staff status update
 */
export async function updateComplaintStatus(id, newStatus) {
  const { data: complaint, error: fetchError } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !complaint) throw new Error('Complaint not found');

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

  const timeline = [...complaint.timeline];
  const existingStep = timeline.find((t) => t.status === newStatus);
  if (!existingStep) {
    timeline.push({
      status: newStatus,
      timestamp: `${formattedDate} · ${formattedTime}`,
      note: `Status updated to ${newStatus} by municipal authority.`
    });
  }

  const { data: updatedComplaint, error: updateError } = await supabase
    .from('complaints')
    .update({ 
      status: newStatus, 
      updated_at: now,
      timeline 
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) throw new Error('Failed to update complaint');

  return updatedComplaint;
}

/**
 * Send Citizen Follow-up
 */
export async function sendFollowUp(id, message) {
  const { data: complaint, error: fetchError } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !complaint) throw new Error('Complaint not found');

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const timeline = [...complaint.timeline];
  timeline.push({
    status: complaint.status,
    timestamp: `${formattedDate} · ${formattedTime}`,
    note: `Citizen Follow-up sent: "${message}"`
  });

  const { data: updatedComplaint, error: updateError } = await supabase
    .from('complaints')
    .update({ timeline })
    .eq('id', id)
    .select()
    .single();

  if (updateError) throw new Error('Failed to send follow up');

  return updatedComplaint;
}

/**
 * Mock image upload
 */
export async function uploadComplaintImage(file) {
  await delay(300);
  if (file && typeof file !== 'string') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  return 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800';
}
