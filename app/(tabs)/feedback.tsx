import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/styles/theme';

export default function FeedbackScreen() {
  const { addFeedback } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newFeedback = {
      ...formData,
      issueId: 0, // General feedback not tied to specific issue
      status: "In Review" as const,
      submittedAt: new Date().toISOString()
    };

    addFeedback(newFeedback);
    
    Alert.alert(
      'Feedback Submitted',
      'Thank you for your feedback. We\'ll review it shortly and get back to you if needed.',
      [{ text: 'OK', onPress: () => {
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: ""
        });
        setErrors({});
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Share Your Feedback</Text>
          <Text style={styles.subtitle}>
            Help us improve our services with your valuable input
          </Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="chatbubble" size={24} color={theme.colors.primary} />
            <Text style={styles.formTitle}>Submit Feedback</Text>
          </View>
          <Text style={styles.formSubtitle}>
            Your feedback helps us serve the community better
          </Text>

          <View style={styles.form}>
            <Input
              label="Full Name *"
              placeholder="Your full name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              error={errors.name}
            />

            <Input
              label="Email Address *"
              placeholder="your.email@example.com"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Your Feedback *"
              placeholder="Share your thoughts, suggestions, or concerns..."
              value={formData.message}
              onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
              multiline
              numberOfLines={6}
              style={styles.textArea}
              error={errors.message}
            />

            <Button
              title="Submit Feedback"
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </View>
        </Card>

        <Card style={styles.contactCard}>
          <Text style={styles.contactTitle}>Other Ways to Reach Us</Text>
          <View style={styles.contactList}>
            <View style={styles.contactItem}>
              <View style={styles.contactItemLeft}>
                <Ionicons name="call" size={20} color={theme.colors.primary} />
                <Text style={styles.contactLabel}>Phone</Text>
              </View>
              <Text style={styles.contactValue}>011 123 4567</Text>
            </View>
            
            <View style={styles.contactItem}>
              <View style={styles.contactItemLeft}>
                <Ionicons name="mail" size={20} color={theme.colors.primary} />
                <Text style={styles.contactLabel}>Email</Text>
              </View>
              <Text style={styles.contactValue}>info@setshaba.gov.za</Text>
            </View>
            
            <View style={styles.contactItem}>
              <View style={styles.contactItemLeft}>
                <Ionicons name="time" size={20} color={theme.colors.primary} />
                <Text style={styles.contactLabel}>Office Hours</Text>
              </View>
              <Text style={styles.contactValue}>Mon-Fri 8AM-5PM</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your Voice Matters</Text>
          <Text style={styles.infoText}>
            We value your feedback and use it to continuously improve our services. 
            Every suggestion helps us better serve our community.
          </Text>
          <View style={styles.infoStats}>
            <View style={styles.infoStat}>
              <Text style={styles.infoStatNumber}>24h</Text>
              <Text style={styles.infoStatLabel}>Average Response Time</Text>
            </View>
            <View style={styles.infoStat}>
              <Text style={styles.infoStatNumber}>95%</Text>
              <Text style={styles.infoStatLabel}>Satisfaction Rate</Text>
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
  formCard: {
    marginBottom: theme.spacing.lg,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  formTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginLeft: theme.spacing.sm,
  },
  formSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.lg,
  },
  form: {
    gap: theme.spacing.md,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  contactCard: {
    marginBottom: theme.spacing.lg,
  },
  contactTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.md,
  },
  contactList: {
    gap: theme.spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray700,
    marginLeft: theme.spacing.sm,
  },
  contactValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray600,
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
    marginBottom: theme.spacing.lg,
  },
  infoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoStat: {
    alignItems: 'center',
  },
  infoStatNumber: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  infoStatLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
});