export const mockData = {
  issues: [
    {
      id: 1,
      title: "Pipe Burst on Main Street",
      category: "Water" as const,
      description: "A main water pipe has burst, affecting multiple households.",
      location: "Main Street, Soweto",
      status: "In Progress" as const,
      progress: 40,
      timeline: [
        { time: "08:30 AM", event: "Reported" },
        { time: "09:15 AM", event: "Repair crew dispatched" },
        { time: "11:00 AM", event: "Excavation started" },
      ],
      isUrgent: true,
      reportedBy: "Citizen Report",
      reportedAt: "2025-08-16T08:30:00Z",
    },
    {
      id: 2,
      title: "Power Outage on 5th Avenue",
      category: "Electricity" as const,
      description: "Transformer malfunction causing power outage.",
      location: "5th Avenue, Johannesburg",
      status: "Reported" as const,
      progress: 0,
      timeline: [
        { time: "07:45 AM", event: "Reported" },
      ],
      isUrgent: false,
      reportedBy: "Citizen Report",
      reportedAt: "2025-08-16T07:45:00Z",
    },
    {
      id: 3,
      title: "Pothole Repair at Elm Street",
      category: "Roads" as const,
      description: "Large potholes causing traffic disruption.",
      location: "Elm Street, Cape Town",
      status: "Resolved" as const,
      progress: 100,
      timeline: [
        { time: "07:00 AM", event: "Reported" },
        { time: "09:30 AM", event: "Repair crew assigned" },
        { time: "12:00 PM", event: "Repair completed" },
      ],
      isUrgent: false,
      reportedBy: "City Inspector",
      reportedAt: "2025-08-15T07:00:00Z",
    },
  ],
  events: [
    {
      id: 1,
      title: "Water outage briefing",
      description: "Community briefing at City Hall about ongoing water issues.",
      date: "2025-08-20",
      location: "City Hall, Soweto",
      time: "14:00",
    },
    {
      id: 2,
      title: "Infrastructure Planning Meeting",
      description: "Public consultation on upcoming road improvements.",
      date: "2025-08-25",
      location: "Community Center, Johannesburg",
      time: "18:00",
    },
  ],
  feedback: [
    {
      id: 1,
      name: "Thabo M.",
      email: "thabo@example.com",
      message: "Side streets affected by the main pipe burst.",
      issueId: 1,
      status: "In Review" as const,
      submittedAt: "2025-08-16T10:15:00Z",
    },
    {
      id: 2,
      name: "Sarah K.",
      email: "sarah@example.com", 
      message: "Thank you for the quick response to the power outage.",
      issueId: 2,
      status: "Acknowledged" as const,
      submittedAt: "2025-08-16T08:30:00Z",
    },
  ],
  announcements: [
    {
      id: 1,
      title: "City-wide Water Maintenance",
      description: "Maintenance scheduled for next week. Some areas may have intermittent supply.",
      publishedAt: "2025-08-16T06:00:00Z",
      isUrgent: false,
    },
    {
      id: 2,
      title: "Emergency Response Protocol Updates",
      description: "New emergency response procedures are now in effect for faster issue resolution.",
      publishedAt: "2025-08-15T14:00:00Z",
      isUrgent: true,
    },
  ],
};

export type Category = "Water" | "Electricity" | "Roads" | "Waste" | "Other";
export type Status = "Reported" | "In Progress" | "Resolved";
export type FeedbackStatus = "In Review" | "Acknowledged" | "Resolved";

export interface Issue {
  id: number;
  title: string;
  category: Category;
  description: string;
  location: string;
  status: Status;
  progress: number;
  timeline: { time: string; event: string; }[];
  isUrgent: boolean;
  reportedBy: string;
  reportedAt: string;
}
export type Event = typeof mockData.events[0];
export type Feedback = typeof mockData.feedback[0];
export type Announcement = typeof mockData.announcements[0];

export const categoryIcons = {
  Water: "💧",
  Electricity: "⚡",
  Roads: "🚧",
  Waste: "🗑️",
  Other: "❓",
};

export const statusColors = {
  Reported: "status-reported",
  "In Progress": "status-progress", 
  Resolved: "status-resolved",
};