import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { Badge } from './Badge';
import { Issue, categoryIcons } from '../types';
import { theme } from '../styles/theme';

interface IssueCardProps {
  issue: Issue;
  onPress?: () => void;
  showProgress?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({ 
  issue, 
  onPress,
  showProgress = true 
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Reported': return 'default';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      default: return 'default';
    }
  };

  const formatLocation = (location: string, coordinates?: { latitude: number; longitude: number }) => {
    // If we have a readable location, use it
    if (location && !location.includes(',') && !location.match(/^-?\d+\.\d+/)) {
      return location;
    }
    
    // If coordinates exist, format them nicely
    if (coordinates) {
      return `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
    }
    
    // Fallback to original location
    return location;
  };

  const CardContent = (
    <Card style={[styles.card, issue.isUrgent && styles.urgentCard]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.categoryIcon}>{categoryIcons[issue.category]}</Text>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, issue.isUrgent && styles.urgentTitle]}>
              {issue.title}
            </Text>
            <Text style={styles.location}>
              📍 {formatLocation(issue.location, issue.coordinates)}
            </Text>
          </View>
        </View>
        <View style={styles.badges}>
          <Badge text={issue.status} variant={getStatusVariant(issue.status)} size="sm" />
          {issue.isUrgent && (
            <Badge text="Urgent" variant="urgent" size="sm" />
          )}
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {issue.description}
      </Text>

      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercent}>{issue.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${issue.progress}%` },
                issue.progress === 100 && styles.progressComplete
              ]} 
            />
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          🕒 Reported {formatDate(issue.reportedAt)} at {formatTime(issue.reportedAt)}
        </Text>
      </View>
    </Card>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  card: {
    marginVertical: theme.spacing.xs,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.urgent,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  categoryIcon: {
    fontSize: theme.fontSize.xl,
    marginRight: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.xs / 2,
  },
  urgentTitle: {
    color: theme.colors.urgent,
  },
  location: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
  },
  badges: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs / 2,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray700,
  },
  progressPercent: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressComplete: {
    backgroundColor: theme.colors.success,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    paddingTop: theme.spacing.sm,
  },
  timestamp: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray500,
  },
});