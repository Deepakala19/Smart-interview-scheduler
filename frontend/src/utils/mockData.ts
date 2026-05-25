export const mockInterviews = [
  { id: 1, candidate: "Sarah Chen", admin: "Alex Rivera", role: "Senior Frontend Engineer", time: "2026-03-17T10:00:00Z", status: "confirmed", type: "Technical" },
  { id: 2, candidate: "Marcus Johnson", admin: "Sarah Chen", role: "Product Designer", time: "2026-03-17T14:30:00Z", status: "pending", type: "Portfolio Review" },
  { id: 3, candidate: "Elena Rodriguez", admin: "Alex Rivera", role: "Backend Architect", time: "2026-03-18T09:00:00Z", status: "rescheduled", type: "System Design" },
  { id: 4, candidate: "David Kim", admin: "Sarah Chen", role: "QA Engineer", time: "2026-03-19T11:00:00Z", status: "confirmed", type: "Behavioral" },
];

export const mockCandidates = [
  { id: 1, name: "Sarah Chen", email: "sarah@example.com", status: "Interviewing", role: "Frontend" },
  { id: 2, name: "Marcus Johnson", email: "marcus@example.com", status: "Pending", role: "Design" },
  { id: 3, name: "Elena Rodriguez", email: "elena@example.com", status: "Offered", role: "Backend" },
];

export const mockAdmins = [
  { id: 1, name: "Alex Rivera", role: "Engineering Manager", expertise: ["React", "Node.js"] },
  { id: 2, name: "Sarah Chen", role: "Lead Designer", expertise: ["Figma", "UX Research"] },
];

export const mockStats = {
  totalCandidates: 124,
  totalAdmins: 18,
  scheduledInterviews: 42,
  completedInterviews: 86,
};

export const mockChartData = [
  { name: 'Mon', interviews: 4 },
  { name: 'Tue', interviews: 7 },
  { name: 'Wed', interviews: 5 },
  { name: 'Thu', interviews: 8 },
  { name: 'Fri', interviews: 6 },
];
