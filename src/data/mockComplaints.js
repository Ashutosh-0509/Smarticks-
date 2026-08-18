export const MOCK_DEPARTMENTS = [
  { id: 'dept-roads', name: 'Roads & Infrastructure' },
  { id: 'dept-sanitation', name: 'Sanitation & Solid Waste' },
  { id: 'dept-water', name: 'Water Supply & Sewage' },
  { id: 'dept-electrical', name: 'Electrical & Street Lighting' },
  { id: 'dept-drainage', name: 'Storm Water Drainage' },
  { id: 'dept-general', name: 'General Civic Services' }
];

export const MOCK_CATEGORIES = [
  'Pothole',
  'Garbage',
  'Water Leakage',
  'Streetlight',
  'Drainage',
  'Road Damage',
  'Electricity',
  'Other'
];

// Seed the database with demo data for the hackathon
export const MOCK_COMPLAINTS = [
  {
    id: 'CR-1045',
    title: 'Severe pothole on arterial road',
    description: 'A large crater has formed on the left lane of Main Arterial Road causing vehicles to swerve into oncoming traffic.',
    category: 'Pothole',
    priority: 'High',
    department_id: 'dept-roads',
    department_name: 'Roads & Infrastructure',
    status: 'Assigned',
    location: 'Main Arterial Road, Sector 4',
    coordinates: { lat: 19.076, lng: 73.003 },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800',
    ai_summary: 'Major structural road damage creating immediate transit hazard.',
    ai_reasoning: 'Classified as high priority due to location on main transit route and risk of vehicle damage.',
    ai_confidence: 0.94,
    evidence_score: 92,
    evidence_flags: [],
    is_duplicate: false,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '17 Aug · 10:00 AM',
        note: 'Complaint logged successfully by citizen.'
      },
      {
        status: 'Assigned',
        timestamp: '17 Aug · 02:30 PM',
        note: 'Status updated to Assigned by municipal authority.'
      }
    ]
  },
  {
    id: 'CR-1046',
    title: 'Illegal garbage dumping',
    description: 'Construction debris and household waste dumped illegally near the community park entrance.',
    category: 'Garbage',
    priority: 'Medium',
    department_id: 'dept-sanitation',
    department_name: 'Sanitation & Solid Waste',
    status: 'In Progress',
    location: 'Community Park Entrance, Sector 9',
    coordinates: { lat: 19.080, lng: 73.008 },
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800',
    ai_summary: 'Unsanitary solid waste accumulation in public recreational zone.',
    ai_reasoning: 'Classified as medium priority. Requires scheduled dispatch of sanitation vehicles.',
    ai_confidence: 0.88,
    evidence_score: 85,
    evidence_flags: [],
    is_duplicate: false,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '16 Aug · 09:15 AM',
        note: 'Complaint logged successfully by citizen.'
      },
      {
        status: 'In Progress',
        timestamp: '17 Aug · 11:00 AM',
        note: 'Status updated to In Progress by municipal authority.'
      }
    ]
  },
  {
    id: 'CR-1047',
    title: 'Streetlights not working',
    description: 'Entire block of streetlights has been out for 3 days, causing visibility and safety issues at night.',
    category: 'Streetlight',
    priority: 'Medium',
    department_id: 'dept-electrical',
    department_name: 'Electrical & Street Lighting',
    status: 'Submitted',
    location: 'Oakwood Avenue, Sector 12',
    coordinates: { lat: 19.085, lng: 73.015 },
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&q=80&w=800',
    ai_summary: 'Street illumination outage spanning multiple poles.',
    ai_reasoning: 'Identified as electrical grid issue rather than isolated bulb failure.',
    ai_confidence: 0.85,
    evidence_score: 45,
    evidence_flags: ['Night photo visibility is too low for positive verification'],
    is_duplicate: false,
    timeline: [
      {
        status: 'Submitted',
        timestamp: '18 Aug · 08:00 AM',
        note: 'Complaint logged successfully by citizen.'
      }
    ]
  }
];
