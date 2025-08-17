export type Category = "Water" | "Electricity" | "Roads" | "Waste" | "Other";
export type Status = "Reported" | "In Progress" | "Resolved";
export type FeedbackStatus = "In Review" | "Acknowledged" | "Resolved";

export interface Issue {
  id: number;
  title: string;
  category: Category;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  status: Status;
  progress: number;
  timeline: { time: string; event: string; }[];
  isUrgent: boolean;
  reportedBy: string;
  reportedAt: string;
  imageUrl?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  time: string;
}

export interface Feedback {
  id: number;
  name: string;
  email: string;
  message: string;
  issueId: number;
  status: FeedbackStatus;
  submittedAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  publishedAt: string;
  isUrgent: boolean;
}