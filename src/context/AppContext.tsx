import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Issue, Event, Feedback, Announcement, Category, FeedbackStatus } from '../types';
import { mockData } from '../data/mockData';

interface AppContextType {
  // Data
  issues: Issue[];
  events: Event[];
  feedback: Feedback[];
  announcements: Announcement[];
  
  // Auth
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  
  // Issue management
  updateIssue: (id: number, updates: Partial<Issue>) => void;
  addIssue: (issue: Omit<Issue, 'id'>) => void;
  deleteIssue: (id: number) => void;
  
  // Feedback management
  addFeedback: (feedback: Omit<Feedback, 'id'>) => void;
  updateFeedbackStatus: (id: number, status: FeedbackStatus) => void;
  
  // Event management
  addEvent: (event: Omit<Event, 'id'>) => void;
  
  // Announcement management
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>(mockData.issues);
  const [events, setEvents] = useState<Event[]>(mockData.events);
  const [feedback, setFeedback] = useState<Feedback[]>(mockData.feedback);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockData.announcements);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage whenever data changes
  useEffect(() => {
    saveData();
  }, [issues, events, feedback, announcements]);

  const loadData = async () => {
    try {
      const savedIssues = await AsyncStorage.getItem('setshaba-issues');
      const savedEvents = await AsyncStorage.getItem('setshaba-events');
      const savedFeedback = await AsyncStorage.getItem('setshaba-feedback');
      const savedAnnouncements = await AsyncStorage.getItem('setshaba-announcements');

      if (savedIssues) setIssues(JSON.parse(savedIssues));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedFeedback) setFeedback(JSON.parse(savedFeedback));
      if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('setshaba-issues', JSON.stringify(issues));
      await AsyncStorage.setItem('setshaba-events', JSON.stringify(events));
      await AsyncStorage.setItem('setshaba-feedback', JSON.stringify(feedback));
      await AsyncStorage.setItem('setshaba-announcements', JSON.stringify(announcements));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const updateIssue = (id: number, updates: Partial<Issue>) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, ...updates } : issue
    ));
  };

  const addIssue = (issue: Omit<Issue, 'id'>) => {
    const isUrgent = issue.category === "Water" || 
                    issue.category === "Electricity" ||
                    issue.title.toLowerCase().includes("burst") ||
                    issue.title.toLowerCase().includes("leak") ||
                    issue.title.toLowerCase().includes("outage") ||
                    issue.title.toLowerCase().includes("emergency") ||
                    issue.description.toLowerCase().includes("urgent") ||
                    issue.description.toLowerCase().includes("emergency");
    
    const newIssue = {
      ...issue,
      isUrgent,
      id: Math.max(...issues.map(i => i.id), 0) + 1,
    };
    setIssues(prev => [newIssue, ...prev]);
  };

  const deleteIssue = (id: number) => {
    setIssues(prev => prev.filter(issue => issue.id !== id));
  };

  const addFeedback = (newFeedback: Omit<Feedback, 'id'>) => {
    const newFeedbackItem = {
      ...newFeedback,
      id: Math.max(...feedback.map(f => f.id), 0) + 1,
    };
    setFeedback(prev => [newFeedbackItem, ...prev]);
  };

  const updateFeedbackStatus = (id: number, status: FeedbackStatus) => {
    setFeedback(prev => prev.map(f => 
      f.id === id ? { ...f, status } : f
    ));
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: Math.max(...events.map(e => e.id), 0) + 1,
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement = {
      ...announcement,
      id: Math.max(...announcements.map(a => a.id), 0) + 1,
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        issues,
        events,
        feedback,
        announcements,
        isAdmin,
        setIsAdmin,
        updateIssue,
        addIssue,
        deleteIssue,
        addFeedback,
        updateFeedbackStatus,
        addEvent,
        addAnnouncement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};