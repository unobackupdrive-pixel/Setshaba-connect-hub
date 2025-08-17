import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { IssueCard } from '../../src/components/IssueCard';
import { theme } from '../../src/styles/theme';

export default function HomeScreen() {
  const { issues, announcements } = useApp();
  
  const urgentIssues = issues.filter(issue => issue.isUrgent);
  const recentIssues = issues.slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 2);
  
  const stats = {
    total: issues.length,
    urgent: urgentIssues.length,
    inProgress: issues.filter(i => i.status === "In Progress").length,
    resolved: issues.filter(i => i.status === "Resolved").length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Card style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Welcome to Setshaba Connect</Text>
            <Text style={styles.heroSubtitle}>
              Bridging the gap between citizens and government
            </Text>
            <Button
              title="Report an Issue"
              onPress={() => router.push('/report')}
              style={styles.heroButton}
            />
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="warning" size={24} color={theme.colors.reported} />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Issues</Text>
            </View>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="alert-circle" size={24} color={theme.colors.urgent} />
              <Text style={styles.statNumber}>{stats.urgent}</Text>
              <Text style={styles.statLabel}>Urgent</Text>
            </View>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="time" size={24} color={theme.colors.inProgress} />
              <Text style={styles.statNumber}>{stats.inProgress}</Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              <Text style={styles.statNumber}>{stats.resolved}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </Card>
        </View>

        {/* Urgent Issues Alert */}
        {urgentIssues.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="alert-circle" size={20} color={theme.colors.urgent} />
                <Text style={[styles.sectionTitle, { color: theme.colors.urgent }]}>
                  Urgent Issues
                </Text>
              </View>
              <Badge text={`${urgentIssues.length} Active`} variant="urgent" size="sm" />
            </View>
            {urgentIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </View>
        )}

        {/* Recent Announcements */}
        {recentAnnouncements.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Updates</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {recentAnnouncements.map(announcement => (
              <Card key={announcement.id} style={styles.announcementCard}>
                <View style={styles.announcementHeader}>
                  <Text style={styles.announcementTitle}>{announcement.title}</Text>
                  {announcement.isUrgent && (
                    <Badge text="Urgent" variant="urgent" size="sm" />
                  )}
                </View>
                <Text style={styles.announcementDescription}>
                  {announcement.description}
                </Text>
                <Text style={styles.announcementDate}>
                  {new Date(announcement.publishedAt).toLocaleDateString()}
                </Text>
              </Card>
            ))}
          </View>
        )}

        {/* Recent Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Issues</Text>
            <TouchableOpacity onPress={() => router.push('/issues')}>
              <Text style={styles.viewAllText}>View All Issues</Text>
            </TouchableOpacity>
          </View>
          {recentIssues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/report')}
            >
              <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>Report Issue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/events')}
            >
              <Ionicons name="calendar" size={32} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>View Events</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/feedback')}
            >
              <Ionicons name="chatbubble" size={32} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>Give Feedback</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Admin Access */}
        <Card style={styles.adminCard}>
          <View style={styles.adminContent}>
            <Ionicons name="shield" size={24} color={theme.colors.gray600} />
            <Text style={styles.adminText}>Government Official?</Text>
            <Button
              title="Admin Login"
              onPress={() => router.push('/admin')}
              variant="outline"
              size="sm"
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  heroCard: {
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.md,
  },
  heroContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  heroTitle: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: theme.spacing.lg,
  },
  heroButton: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.xl,
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
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginLeft: theme.spacing.xs,
  },
  viewAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  announcementCard: {
    marginBottom: theme.spacing.sm,
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
  quickActionsCard: {
    marginTop: theme.spacing.lg,
  },
  quickActionsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  quickActionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray700,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  adminCard: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  adminContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
});