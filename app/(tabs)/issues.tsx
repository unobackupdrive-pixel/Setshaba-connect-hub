import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { IssueCard } from '../../src/components/IssueCard';
import { Input } from '../../src/components/Input';
import { Badge } from '../../src/components/Badge';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Category, Status, categoryIcons } from '../../src/types';
import { theme } from '../../src/styles/theme';

export default function IssuesScreen() {
  const { issues } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<Status | "all">("all");

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || issue.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories: Category[] = ["Water", "Electricity", "Roads", "Waste", "Other"];
  const statuses: Status[] = ["Reported", "In Progress", "Resolved"];

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSearchTerm("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Community Issues</Text>
          <Text style={styles.subtitle}>
            Track the progress of reported issues in your community
          </Text>
        </View>

        {/* Search and Filters */}
        <Card style={styles.filtersCard}>
          <Input
            placeholder="Search issues by title, description, or location..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            containerStyle={styles.searchContainer}
          />
          
          <View style={styles.filtersSection}>
            <View style={styles.filterHeader}>
              <Ionicons name="filter" size={16} color={theme.colors.gray600} />
              <Text style={styles.filterLabel}>Filters:</Text>
            </View>
            
            {/* Category Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>Category:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedCategory === "all" && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedCategory("all")}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedCategory === "all" && styles.filterChipTextActive
                  ]}>
                    All Categories
                  </Text>
                </TouchableOpacity>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      selectedCategory === category && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedCategory === category && styles.filterChipTextActive
                    ]}>
                      {categoryIcons[category]} {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Status Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>Status:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedStatus === "all" && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedStatus("all")}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedStatus === "all" && styles.filterChipTextActive
                  ]}>
                    All Status
                  </Text>
                </TouchableOpacity>
                {statuses.map(status => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterChip,
                      selectedStatus === status && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedStatus(status)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedStatus === status && styles.filterChipTextActive
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Card>

        {/* Results Summary */}
        <View style={styles.resultsHeader}>
          <View style={styles.resultsInfo}>
            <Text style={styles.resultsText}>
              Showing {filteredIssues.length} of {issues.length} issues
            </Text>
            {(selectedCategory !== "all" || selectedStatus !== "all" || searchTerm) && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.statusBadges}>
            <Badge 
              text={`${filteredIssues.filter(i => i.status === "Reported").length} Reported`} 
              variant="default" 
              size="sm" 
            />
            <Badge 
              text={`${filteredIssues.filter(i => i.status === "In Progress").length} In Progress`} 
              variant="warning" 
              size="sm" 
            />
            <Badge 
              text={`${filteredIssues.filter(i => i.status === "Resolved").length} Resolved`} 
              variant="success" 
              size="sm" 
            />
          </View>
        </View>

        {/* Issues List */}
        {filteredIssues.length > 0 ? (
          <View style={styles.issuesList}>
            {filteredIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </View>
        ) : (
          <Card style={styles.emptyState}>
            <View style={styles.emptyStateContent}>
              <Ionicons name="search" size={48} color={theme.colors.gray400} />
              <Text style={styles.emptyStateTitle}>No issues found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search terms or filters
              </Text>
              <Button
                title="Clear Filters"
                onPress={clearFilters}
                variant="primary"
                style={styles.emptyStateButton}
              />
            </View>
          </Card>
        )}
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
  filtersCard: {
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    marginBottom: 0,
  },
  filtersSection: {
    marginTop: theme.spacing.md,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  filterLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.gray700,
    marginLeft: theme.spacing.xs,
  },
  filterGroup: {
    marginBottom: theme.spacing.md,
  },
  filterGroupLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.xs,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray700,
    fontWeight: theme.fontWeight.medium,
  },
  filterChipTextActive: {
    color: theme.colors.white,
  },
  resultsHeader: {
    marginBottom: theme.spacing.md,
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  resultsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray600,
  },
  clearFiltersText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  statusBadges: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  issuesList: {
    paddingBottom: theme.spacing.xl,
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
    marginBottom: theme.spacing.lg,
  },
  emptyStateButton: {
    paddingHorizontal: theme.spacing.xl,
  },
});