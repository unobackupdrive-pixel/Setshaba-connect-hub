import { Issue, Event, Feedback, Announcement } from '../types';

export const mockData = {
  issues: [
    {
      id: 1,
      title: "Water Pipe Burst on Main Street",
      category: "Water" as const,
      description: "A main water pipe has burst near the intersection, affecting multiple households in the area.",
      location: "Main Street, Soweto",
      coordinates: { latitude: -26.2041, longitude: 27.8650 },
      status: "In Progress" as const,
      progress: 65,
      timeline: [
        { time: "08:30 AM", event: "Issue reported by citizen" },
        { time: "09:15 AM", event: "Emergency crew dispatched" },
        { time: "11:00 AM", event: "Repair work commenced" },
        { time: "02:30 PM", event: "Water supply restored to 60% of area" },
      ],
      isUrgent: true,
      reportedBy: "Citizen Report",
      reportedAt: "2025-01-16T08:30:00Z",
    },
    {
      id: 2,
      title: "Street Light Outage on 5th Avenue",
      category: "Electricity" as const,
      description: "Multiple street lights are not working, creating safety concerns for pedestrians.",
      location: "5th Avenue, Johannesburg",
      coordinates: { latitude: -26.1951, longitude: 28.0568 },
      status: "Reported" as const,
      progress: 15,
      timeline: [
        { time: "07:45 PM", event: "Issue reported" },
        { time: "08:30 PM", event: "Assigned to electrical team" },
      ],
      isUrgent: false,
      reportedBy: "Citizen Report",
      reportedAt: "2025-01-15T19:45:00Z",
    },
    {
      id: 3,
      title: "Pothole Repair Completed",
      category: "Roads" as const,
      description: "Large potholes that were causing traffic disruption have been successfully repaired.",
      location: "Elm Street, Cape Town",
      coordinates: { latitude: -33.9249, longitude: 18.4241 },
      status: "Resolved" as const,
      progress: 100,
      timeline: [
        { time: "07:00 AM", event: "Issue reported" },
        { time: "09:30 AM", event: "Road crew assigned" },
        { time: "12:00 PM", event: "Repair work completed" },
        { time: "02:00 PM", event: "Quality inspection passed" },
      ],
      isUrgent: false,
      reportedBy: "City Inspector",
      reportedAt: "2025-01-14T07:00:00Z",
    },
  ] as Issue[],
  
  events: [
    {
      id: 1,
      title: "Community Water Crisis Meeting",
      description: "Public briefing about ongoing water infrastructure improvements and temporary supply arrangements.",
      date: "2025-01-25",
      location: "City Hall, Soweto",
      time: "14:00",
    },
    {
      id: 2,
      title: "Road Infrastructure Planning Session",
      description: "Community consultation on upcoming road improvements and traffic management plans.",
      date: "2025-02-02",
      location: "Community Center, Johannesburg",
      time: "18:00",
    },
  ] as Event[],
  
  feedback: [
    {
      id: 1,
      name: "Thabo Mthembu",
      email: "thabo.m@example.com",
      message: "The water issue on Main Street has also affected the side streets. Please check the connecting pipes as well.",
      issueId: 1,
      status: "In Review" as const,
      submittedAt: "2025-01-16T10:15:00Z",
    },
    {
      id: 2,
      name: "Sarah Khumalo",
      email: "sarah.k@example.com", 
      message: "Thank you for the quick response to the street light issue. The area feels much safer now.",
      issueId: 2,
      status: "Acknowledged" as const,
      submittedAt: "2025-01-16T08:30:00Z",
    },
  ] as Feedback[],
  
  announcements: [
    {
      id: 1,
      title: "Scheduled Water Maintenance",
      description: "City-wide water system maintenance scheduled for next week. Some areas may experience intermittent supply between 2AM-6AM.",
      publishedAt: "2025-01-16T06:00:00Z",
      isUrgent: false,
    },
    {
      id: 2,
      title: "Emergency Response Protocol Update",
      description: "New emergency response procedures are now in effect for faster issue resolution. Average response time reduced to 2 hours.",
      publishedAt: "2025-01-15T14:00:00Z",
      isUrgent: true,
    },
  ] as Announcement[],
};

export const categoryIcons = {
  Water: "💧",
  Electricity: "⚡",
  Roads: "🚧",
  Waste: "🗑️",
  Other: "❓",
};

export const statusColors = {
  Reported: "#3b82f6",
  "In Progress": "#f59e0b", 
  Resolved: "#10b981",
};