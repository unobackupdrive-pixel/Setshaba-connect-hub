import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/styles/theme';

export default function EventsScreen() {
  const { events } = useApp();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Community Events</Text>
          <Text style={styles.subtitle}>
            Stay informed about upcoming community meetings and events
          </Text>
        </View>

        {events.length === 0 ? (
          <Card style={styles.emptyState}>
            <View style={styles.emptyStateContent}>
              <Ionicons name="calendar" size={48} color={theme.colors.gray400} />
              <Text style={styles.emptyStateTitle}>No Events Scheduled</Text>
              <Text style={styles.emptyStateText}>
                Check back soon for upcoming community events and meetings.
              </Text>
            </View>
          </Card>
        ) : (
          <View style={styles.eventsList}>
            {events.map((event) => (
              <Card key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View style={styles.eventTitleContainer}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDescription}>
                      {event.description}
                    </Text>
                  </View>
                  <Badge 
                    text={isUpcoming(event.date) ? "Upcoming" : "Past"} 
                    variant={isUpcoming(event.date) ? "default" : "secondary"}
                  />
                </View>
                
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetail}>
                    <Ionicons name="calendar" size={16} color={theme.colors.gray600} />
                    <Text style={styles.eventDetailText}>
                      {formatDate(event.date)}
                    </Text>
                  </View>
                  
                  <View style={styles.eventDetail}>
                    <Ionicons name="location" size={16} color={theme.colors.gray600} />
                    <Text style={styles.eventDetailText}>
                      {event.location}
                    </Text>
                  </View>
                  
                  <View style={styles.eventDetail}>
                    <Ionicons name="time" size={16} color={theme.colors.gray600} />
                    <Text style={styles.eventDetailText}>
                      {event.time}
                    </Text>
                  </View>
                  
                  <View style={styles.eventDetail}>
                    <Ionicons name="people" size={16} color={theme.colors.gray600} />
                    <Text style={styles.eventDetailText}>
                      Open to all residents
                    </Text>
                  </View>
                </View>
                
                {isUpcoming(event.date) && (
                  <View style={styles.eventActions}>
                    <Button
                      title="Add to Calendar"
                      onPress={() => {
                        // In a real app, this would integrate with the device calendar
                        console.log('Add to calendar:', event.title);
                      }}
                      variant="outline"
                      style={styles.calendarButton}
                    />
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Stay Connected</Text>
          <Text style={styles.infoText}>
            Community events are a great way to stay informed about local developments 
            and have your voice heard in important decisions.
          </Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="call" size={16} color={theme.colors.primary} />
              <Text style={styles.contactText}>011 123 4567</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="mail" size={16} color={theme.colors.primary} />
              <Text style={styles.contactText}>events@setshaba.gov.za</Text>
            </View>
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
  header: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray600,
    textAlign: 'center',
  },
  emptyState: {
    marginTop: theme.spacing.lg,
  },
  emptyStateContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray600,
    textAlign: 'center',
  },
  eventsList: {
    paddingBottom: theme.spacing.xl,
  },
  eventCard: {
    marginBottom: theme.spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  eventTitleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  eventTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.sm,
  },
  eventDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    lineHeight: 20,
  },
  eventDetails: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    marginLeft: theme.spacing.sm,
  },
  eventActions: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
    paddingTop: theme.spacing.md,
  },
  calendarButton: {
    width: '100%',
  },
  infoCard: {
    marginBottom: theme.spacing.xl,
  },
  infoTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  contactInfo: {
    gap: theme.spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    marginLeft: theme.spacing.sm,
  },
});