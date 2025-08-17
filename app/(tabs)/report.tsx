import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useApp } from '../../src/context/AppContext';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Category } from '../../src/types';
import { theme } from '../../src/styles/theme';

export default function ReportScreen() {
  const { addIssue } = useApp();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
  });
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: "Water", label: "💧 Water", icon: "water" },
    { value: "Electricity", label: "⚡ Electricity", icon: "flash" },
    { value: "Roads", label: "🚧 Roads", icon: "car" },
    { value: "Waste", label: "🗑️ Waste", icon: "trash" },
    { value: "Other", label: "❓ Other", icon: "help-circle" },
  ];

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature.'
        );
        setIsLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      try {
        // Try to get a readable address
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        
        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          let locationString = "";
          
          if (address.street) {
            locationString = address.street;
          }
          if (address.city) {
            locationString += locationString ? `, ${address.city}` : address.city;
          }
          
          if (!locationString) {
            locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }
          
          setFormData(prev => ({ 
            ...prev, 
            location: locationString,
          }));
          
          Alert.alert(
            'Location Added',
            'Your current location has been added to the report.'
          );
        } else {
          throw new Error('No address found');
        }
      } catch (error) {
        // Fallback to coordinates
        const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setFormData(prev => ({ 
          ...prev, 
          location: locationString,
        }));
        
        Alert.alert(
          'Location Added',
          'Location coordinates have been added. You can edit this to be more specific.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to get your location. Please enter it manually.'
      );
    }
    
    setIsLocating(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Issue title is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newIssue = {
      title: formData.title,
      category: formData.category as Category,
      location: formData.location,
      description: formData.description,
      status: "Reported" as const,
      progress: 0,
      timeline: [{
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: "Reported"
      }],
      reportedBy: "Citizen Report",
      reportedAt: new Date().toISOString()
    };

    addIssue(newIssue);
    
    const trackingId = `TR${Date.now().toString().slice(-6)}`;
    
    Alert.alert(
      'Report Submitted Successfully',
      `Your tracking ID is: ${trackingId}\n\nThank you for helping improve our community!`,
      [{ text: 'OK', onPress: () => {
        // Reset form
        setFormData({
          title: "",
          category: "",
          location: "",
          description: "",
        });
        setErrors({});
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Report an Issue</Text>
          <Text style={styles.subtitle}>
            Help us serve you better by reporting community issues
          </Text>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="send" size={24} color={theme.colors.primary} />
            <Text style={styles.formTitle}>Submit New Report</Text>
          </View>
          <Text style={styles.formSubtitle}>
            Provide details about the issue you'd like to report
          </Text>

          <View style={styles.form}>
            <Input
              label="Issue Title *"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              error={errors.title}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.categoryGrid}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryOption,
                      formData.category === category.value && styles.categoryOptionSelected
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, category: category.value }))}
                  >
                    <Text style={[
                      styles.categoryText,
                      formData.category === category.value && styles.categoryTextSelected
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location *</Text>
              <View style={styles.locationInputContainer}>
                <Input
                  placeholder="Street address or area"
                  value={formData.location}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                  containerStyle={styles.locationInput}
                  error={errors.location}
                />
                <Button
                  title={isLocating ? "Locating..." : "Use Location"}
                  onPress={handleUseCurrentLocation}
                  variant="outline"
                  size="sm"
                  disabled={isLocating}
                  style={styles.locationButton}
                />
              </View>
              <Text style={styles.helperText}>
                Tap "Use Location" to automatically add your current location
              </Text>
            </View>

            <Input
              label="Description *"
              placeholder="Detailed description of the issue"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              style={styles.textArea}
              error={errors.description}
            />

            <Button
              title="Submit Report"
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <View style={styles.infoSteps}>
            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Your report is reviewed by our team</Text>
            </View>
            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>We assign the appropriate department</Text>
            </View>
            <View style={styles.infoStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>You can track progress in the Issues tab</Text>
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
  inputGroup: {
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
    minWidth: '45%',
  },
  categoryOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: theme.colors.white,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  locationInput: {
    flex: 1,
    marginBottom: 0,
  },
  locationButton: {
    marginTop: 24, // Align with input field
  },
  helperText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray500,
    marginTop: theme.spacing.xs,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs / 2,
  },
  infoCard: {
    marginBottom: theme.spacing.xl,
  },
  infoTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.md,
  },
  infoSteps: {
    gap: theme.spacing.md,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  stepNumberText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  stepText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray700,
    flex: 1,
  },
});