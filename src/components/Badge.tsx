import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'urgent';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', size = 'md' }) => {
  return (
    <View style={[styles.badge, styles[variant], styles[size]]}>
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    alignSelf: 'flex-start',
  },
  
  // Variants
  default: {
    backgroundColor: theme.colors.gray100,
  },
  success: {
    backgroundColor: theme.colors.success,
  },
  warning: {
    backgroundColor: theme.colors.warning,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
  urgent: {
    backgroundColor: theme.colors.urgent,
  },
  
  // Sizes
  sm: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
  },
  
  // Text styles
  text: {
    fontWeight: theme.fontWeight.medium,
    textAlign: 'center',
  },
  defaultText: {
    color: theme.colors.gray700,
  },
  successText: {
    color: theme.colors.white,
  },
  warningText: {
    color: theme.colors.white,
  },
  dangerText: {
    color: theme.colors.white,
  },
  urgentText: {
    color: theme.colors.white,
  },
  
  // Size text
  smText: {
    fontSize: theme.fontSize.xs,
  },
  mdText: {
    fontSize: theme.fontSize.sm,
  },
});