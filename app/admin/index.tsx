import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/styles/theme';

export default function AdminLoginScreen() {
  const { setIsAdmin } = useApp();

  const handleAdminLogin = () => {
    setIsAdmin(true);
    Alert.alert(
      'Admin Access Granted',
      'Welcome to the admin dashboard.',
      [{ text: 'OK', onPress: () => router.replace('/admin/dashboard') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.loginCard}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield" size={32} color={theme.colors.white} />
            </View>
            <Text style={styles.title}>Admin Login</Text>
            <Text style={styles.subtitle}>
              Click below to access the administrative dashboard
            </Text>
          </View>
          
          <Button
            title="Enter Admin Dashboard"
            onPress={handleAdminLogin}
            style={styles.loginButton}
          />
          
          <View style={styles.demoNotice}>
            <Text style={styles.demoTitle}>Demo Mode</Text>
            <Text style={styles.demoText}>
              One-click access for demonstration purposes
            </Text>
          </View>
        </Card>
        
        <Button
          title="← Back to Citizen Portal"
          onPress={() => router.back()}
          variant="outline"
          style={styles.backButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  loginCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
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
  loginButton: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  demoNotice: {
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.xs,
  },
  demoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    textAlign: 'center',
  },
  backButton: {
    marginTop: theme.spacing.lg,
  },
});