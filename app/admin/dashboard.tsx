import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { IssueCard } from '../../src/components/IssueCard';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { Issue, Category, Status } from '../../src/types';
import { theme } from '../../src/styles/theme';

type AdminTab = 'dashboard' | 'issues' | 'feedback' | 'announcements';

export default function AdminDashboardScreen() {
  const { 
    issues, 
    feedback, 
    events, 
    announcements,
    setIsAdmin,
    updateIssue,
    addIssue,
    deleteIssue,
    updateFeedbackStatus,
    addAnnouncement
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newIssueForm, setNewIssueForm] = useState({
    title: '',
    category: '',
    location: '',
    description: ''
  });
  const [newAnnouncementForm, setNewAnnouncementForm] = useState({
    title: '',
    description: '',
    isUrgent: false
  });

  const stats = {
    totalIssues: issues.length,
    activeIssues: issues.filter(issue => issue.status !== "Resolved").length,
    resolvedIssues: issues.filter(issue => issue.status === "Resolved").length,
    pendingFeedback: feedback.filter(f => f.status === "In Review").length,
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length
  };

  const urgentIssues = issues.filter(issue => 
    issue.status !== "Resolved" && issue.isUrgent
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            setIsAdmin(false);
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleUpdateIssueStatus = (issue: Issue, newStatus: Status) => {
    const progressMap = {
      "Reported": 15,
      "In Progress": 60,
      "Resolved": 100
    };

    updateIssue(issue.id, {
      status: newStatus,
      progress: progressMap[newStatus]
    });

    Alert.alert('Success', `Issue status updated to ${newStatus}`);
    setSelectedIssue(null);
  };

  const handleDeleteIssue = (issue: Issue) => {
    Alert.alert(
      'Delete Issue',
      'Are you sure you want to delete this issue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteIssue(issue.id);
            Alert.alert('Success', 'Issue deleted successfully');
            setSelectedIssue(null);
          }
        }
      ]
    );
  };

  const handleAddIssue = () => {
    if (!newIssueForm.title || !newIssueForm.category || !newIssueForm.location || !newIssueForm.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const issue = {
      title: newIssueForm.title,
      category: newIssueForm.category as Category,
      location: newIssueForm.location,
      description: newIssueForm.description,
      status: "Reported" as const,
      progress: 0,
      timeline: [{
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: "Created by admin"
      }],
      reportedBy: "Admin",
      reportedAt: new Date().toISOString()
    };

    addIssue(issue);
    setNewIssueForm({ title: '', category: '', location: '', description: '' });
    Alert.alert('Success', 'Issue created successfully');
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncementForm.title || !newAnnouncementForm.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const announcement = {
      title: newAnnouncementForm.title,
      description: newAnnouncementForm.description,
      isUrgent: newAnnouncementForm.isUrgent,
      publishedAt: new Date().toISOString()
    };

    addAnnouncement(announcement);
    setNewAnnouncementForm({ title: '', description: '', isUrgent: false });
    Alert.alert('Success', 'Announcement published successfully');
  };

  const renderDashboard = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="trending-up" size={24} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{stats.totalIssues}</Text>
            <Text style={styles.statLabel}>Total Issues</Text>
          </View>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="time" size={24} color={theme.colors.warning} />
            <Text style={styles.statNumber}>{stats.activeIssues}</Text>
            <Text style={styles.statLabel}>Active Issues</Text>
          </View>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            <Text style={styles.statNumber}>{stats.resolvedIssues}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="chatbubble" size={24} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{stats.pendingFeedback}</Text>
            <Text style={styles.statLabel}>Feedback</Text>
          </View>
        </Card>
      </View>

      {/* Urgent Issues */}
      {urgentIssues.length > 0 && (
        <Card style={styles.urgentCard}>
          <View style={styles.urgentHeader}>
            <View style={styles.urgentTitleRow}>
              <Ionicons name="alert-circle" size={20} color={theme.colors.urgent} />
              <Text style={styles.urgentTitle}>Urgent Issues Requiring Attention</Text>
            </View>
            <Badge text={`${urgentIssues.length} Active`} variant="urgent" size="sm" />
          </View>
          <Text style={styles.urgentSubtitle}>
            Critical issues that need immediate response
          </Text>
          {urgentIssues.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={styles.urgentIssueItem}
              onPress={() => setSelectedIssue(issue)}
            >
              <View style={styles.urgentIssueContent}>
                <Text style={styles.urgentIssueTitle}>{issue.title}</Text>
                <Text style={styles.urgentIssueLocation}>{issue.location}</Text>
              </View>
              <Badge text={issue.status} variant="warning" size="sm" />
            </TouchableOpacity>
          ))}
        </Card>
      )}

      {/* Recent Activity */}
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Issues</Text>
        {issues.slice(0, 3).map((issue) => (
          <TouchableOpacity
            key={issue.id}
            onPress={() => setSelectedIssue(issue)}
          >
            <IssueCard issue={issue} showProgress={false} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderIssues = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card style={styles.addIssueCard}>
        <Text style={styles.cardTitle}>Add New Issue</Text>
        <Input
          label="Title"
          value={newIssueForm.title}
          onChangeText={(text) => setNewIssueForm(prev => ({ ...prev, title: text }))}
          placeholder="Issue title"
        />
        <View style={styles.categorySelector}>
          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {['Water', 'Electricity', 'Roads', 'Waste', 'Other'].map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryOption,
                  newIssueForm.category === category && styles.categoryOptionSelected
                ]}
                onPress={() => setNewIssueForm(prev => ({ ...prev, category }))}
              >
                <Text style={[
                  styles.categoryText,
                  newIssueForm.category === category && styles.categoryTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Input
          label="Location"
          value={newIssueForm.location}
          onChangeText={(text) => setNewIssueForm(prev => ({ ...prev, location: text }))}
          placeholder="Location"
        />
        <Input
          label="Description"
          value={newIssueForm.description}
          onChangeText={(text) => setNewIssueForm(prev => ({ ...prev, description: text }))}
          placeholder="Description"
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />
        <Button title="Add Issue" onPress={handleAddIssue} />
      </Card>

      <Text style={styles.sectionTitle}>All Issues ({issues.length})</Text>
      {issues.map((issue) => (
        <TouchableOpacity
          key={issue.id}
          onPress={() => setSelectedIssue(issue)}
        >
          <IssueCard issue={issue} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFeedback = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.feedbackStats}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="time" size={20} color={theme.colors.warning} />
            <Text style={styles.statNumber}>{feedback.filter(f => f.status === "In Review").length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="eye" size={20} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{feedback.filter(f => f.status === "Acknowledged").length}</Text>
            <Text style={styles.statLabel}>Acknowledged</Text>
          </View>
        </Card>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text style={styles.statNumber}>{feedback.filter(f => f.status === "Resolved").length}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </Card>
      </View>

      {feedback.map((item) => (
        <Card key={item.id} style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <View>
              <Text style={styles.feedbackName}>{item.name}</Text>
              <Text style={styles.feedbackEmail}>{item.email}</Text>
            </View>
            <Badge 
              text={item.status} 
              variant={item.status === "Resolved" ? "success" : item.status === "Acknowledged" ? "default" : "warning"} 
            />
          </View>
          <Text style={styles.feedbackMessage}>{item.message}</Text>
          <Text style={styles.feedbackDate}>
            {new Date(item.submittedAt).toLocaleDateString()}
          </Text>
          <View style={styles.feedbackActions}>
            {item.status === "In Review" && (
              <Button
                title="Acknowledge"
                onPress={() => updateFeedbackStatus(item.id, "Acknowledged")}
                variant="outline"
                size="sm"
              />
            )}
            {item.status === "Acknowledged" && (
              <Button
                title="Resolve"
                onPress={() => updateFeedbackStatus(item.id, "Resolved")}
                variant="success"
                size="sm"
              />
            )}
          </View>
        </Card>
      ))}
    </ScrollView>
  );

  const renderAnnouncements = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Card style={styles.addAnnouncementCard}>
        <Text style={styles.cardTitle}>Create New Announcement</Text>
        <Input
          label="Title"
          value={newAnnouncementForm.title}
          onChangeText={(text) => setNewAnnouncementForm(prev => ({ ...prev, title: text }))}
          placeholder="Announcement title"
        />
        <Input
          label="Description"
          value={newAnnouncementForm.description}
          onChangeText={(text) => setNewAnnouncementForm(prev => ({ ...prev, description: text }))}
          placeholder="Announcement content"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />
        <View style={styles.urgentToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              newAnnouncementForm.isUrgent && styles.toggleButtonActive
            ]}
            onPress={() => setNewAnnouncementForm(prev => ({ ...prev, isUrgent: !prev.isUrgent }))}
          >
            <Ionicons 
              name={newAnnouncementForm.isUrgent ? "checkmark-circle" : "ellipse-outline"} 
              size={20} 
              color={newAnnouncementForm.isUrgent ? theme.colors.urgent : theme.colors.gray400} 
            />
            <Text style={[
              styles.toggleText,
              newAnnouncementForm.isUrgent && styles.toggleTextActive
            ]}>
              Mark as urgent
            </Text>
          </TouchableOpacity>
        </View>
        <Button title="Publish Announcement" onPress={handleAddAnnouncement} />
      </Card>

      <Text style={styles.sectionTitle}>All Announcements ({announcements.length})</Text>
      {announcements.map((announcement) => (
        <Card key={announcement.id} style={styles.announcementCard}>
          <View style={styles.announcementHeader}>
            <Text style={styles.announcementTitle}>{announcement.title}</Text>
            {announcement.isUrgent && (
              <Badge text="Urgent" variant="urgent" size="sm" />
            )}
          </View>
          <Text style={styles.announcementDescription}>{announcement.description}</Text>
          <Text style={styles.announcementDate}>
            Published {new Date(announcement.publishedAt).toLocaleDateString()}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );

  const renderIssueModal = () => {
    if (!selectedIssue) return null;

    return (
      <View style={styles.modalOverlay}>
        <Card style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Manage Issue</Text>
            <TouchableOpacity onPress={() => setSelectedIssue(null)}>
              <Ionicons name="close" size={24} color={theme.colors.gray600} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.issueTitle}>{selectedIssue.title}</Text>
          <Text style={styles.issueLocation}>{selectedIssue.location}</Text>
          <Text style={styles.issueDescription}>{selectedIssue.description}</Text>
          
          <View style={styles.statusActions}>
            <Text style={styles.statusLabel}>Update Status:</Text>
            <View style={styles.statusButtons}>
              <Button
                title="Reported"
                onPress={() => handleUpdateIssueStatus(selectedIssue, "Reported")}
                variant={selectedIssue.status === "Reported" ? "primary" : "outline"}
                size="sm"
              />
              <Button
                title="In Progress"
                onPress={() => handleUpdateIssueStatus(selectedIssue, "In Progress")}
                variant={selectedIssue.status === "In Progress" ? "primary" : "outline"}
                size="sm"
              />
              <Button
                title="Resolved"
                onPress={() => handleUpdateIssueStatus(selectedIssue, "Resolved")}
                variant={selectedIssue.status === "Resolved" ? "success" : "outline"}
                size="sm"
              />
            </View>
          </View>
          
          <Button
            title="Delete Issue"
            onPress={() => handleDeleteIssue(selectedIssue)}
            variant="danger"
            style={styles.deleteButton}
          />
        </Card>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield" size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Admin Panel</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={20} color={theme.colors.gray600} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons 
            name="grid" 
            size={20} 
            color={activeTab === 'dashboard' ? theme.colors.primary : theme.colors.gray500} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'dashboard' && styles.activeTabText
          ]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'issues' && styles.activeTab]}
          onPress={() => setActiveTab('issues')}
        >
          <Ionicons 
            name="warning" 
            size={20} 
            color={activeTab === 'issues' ? theme.colors.primary : theme.colors.gray500} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'issues' && styles.activeTabText
          ]}>
            Issues
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'feedback' && styles.activeTab]}
          onPress={() => setActiveTab('feedback')}
        >
          <Ionicons 
            name="chatbubble" 
            size={20} 
            color={activeTab === 'feedback' ? theme.colors.primary : theme.colors.gray500} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'feedback' && styles.activeTabText
          ]}>
            Feedback
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'announcements' && styles.activeTab]}
          onPress={() => setActiveTab('announcements')}
        >
          <Ionicons 
            name="megaphone" 
            size={20} 
            color={activeTab === 'announcements' ? theme.colors.primary : theme.colors.gray500} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'announcements' && styles.activeTabText
          ]}>
            Updates
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'issues' && renderIssues()}
        {activeTab === 'feedback' && renderFeedback()}
        {activeTab === 'announcements' && renderAnnouncements()}
      </View>

      {/* Issue Modal */}
      {renderIssueModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginLeft: theme.spacing.sm,
  },
  logoutButton: {
    padding: theme.spacing.xs,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray500,
    marginTop: theme.spacing.xs / 2,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  statCard: {
    width: '48%',
    marginBottom: theme.spacing.sm,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray900,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    marginTop: theme.spacing.xs / 2,
  },
  urgentCard: {
    marginTop: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.urgent,
  },
  urgentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  urgentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.urgent,
    marginLeft: theme.spacing.xs,
  },
  urgentSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.md,
  },
  urgentIssueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  urgentIssueContent: {
    flex: 1,
  },
  urgentIssueTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray900,
  },
  urgentIssueLocation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    marginTop: theme.spacing.xs / 2,
  },
  recentActivity: {
    marginTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.md,
  },
  addIssueCard: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.md,
  },
  categorySelector: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryOption: {
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  categoryOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray700,
  },
  categoryTextSelected: {
    color: theme.colors.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  feedbackStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  feedbackCard: {
    marginBottom: theme.spacing.md,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  feedbackName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray900,
  },
  feedbackEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
  },
  feedbackMessage: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  feedbackDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray500,
    marginBottom: theme.spacing.sm,
  },
  feedbackActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  addAnnouncementCard: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  urgentToggle: {
    marginBottom: theme.spacing.md,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  toggleButtonActive: {
    // Add any active styles if needed
  },
  toggleText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    marginLeft: theme.spacing.sm,
  },
  toggleTextActive: {
    color: theme.colors.urgent,
    fontWeight: theme.fontWeight.medium,
  },
  announcementCard: {
    marginBottom: theme.spacing.md,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  announcementTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  announcementDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  announcementDate: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray500,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  modal: {
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
  },
  issueTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.xs,
  },
  issueLocation: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.sm,
  },
  issueDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  statusActions: {
    marginBottom: theme.spacing.lg,
  },
  statusLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.sm,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  deleteButton: {
    marginTop: theme.spacing.sm,
  },
});