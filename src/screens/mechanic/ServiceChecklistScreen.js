import React, { useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from '../../components/checklist/TaskItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useChecklist from '../../hooks/useChecklist';
import { toggleTaskCompletion, saveTaskNote } from '../../services/checklistService';
import { updateCheckInStatus } from '../../services/vehicleService';
import { COLORS } from '../../constants/colors';

const ServiceChecklistScreen = ({ navigation, route }) => {
  const { checkInId, truckPlate, user } = route.params || {};
  const { tasks, loading, grouped, stats } = useChecklist(checkInId);

  if (!checkInId) {
    return <LoadingSpinner message="Missing service checklist information. Please return and select a vehicle again." />;
  }

  const finaliseCheckIn = async () => {
    try {
      await updateCheckInStatus(checkInId, 'completed');
      Alert.alert('Service Complete', `${truckPlate} has been marked as serviced.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not update vehicle status.');
    }
  };

  const handleToggle = useCallback(
    async (task) => {
      try {
        await toggleTaskCompletion(checkInId, task.id, task, {
          uid: user?.uid || 'unknown',
          name: user?.name || 'Unknown',
        });
      } catch (err) {
        Alert.alert('Error', 'Could not update task. Please try again.');
      }
    },
    [checkInId, user]
  );

  const handleSaveNote = useCallback(
    async (taskDocId, note) => {
      try {
        await saveTaskNote(checkInId, taskDocId, note);
      } catch (err) {
        Alert.alert('Error', 'Could not save note.');
      }
    },
    [checkInId]
  );

  const handleMarkComplete = () => {
    if (stats.critical > 0) {
      Alert.alert(
        'Critical Tasks Pending',
        `There are ${stats.critical} critical safety task(s) not yet completed. Are you sure you want to mark this vehicle as done?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Mark Complete Anyway',
            style: 'destructive',
            onPress: finaliseCheckIn,
          },
        ]
      );
    } else {
      finaliseCheckIn();
    }
  };

  if (loading) return <LoadingSpinner message="Loading checklist…" />;

  // Build SectionList-friendly data
  const sections = Object.entries(grouped).map(([category, data]) => ({
    title: category,
    data,
  }));

  const progressPct = stats.percentage;
  const progressColor =
    progressPct === 100
      ? COLORS.success
      : progressPct > 50
      ? COLORS.warning
      : COLORS.error;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Progress Banner */}
      <View style={styles.progressBanner}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressPlate}>{truckPlate}</Text>
            <Text style={styles.progressLabel}>Service Checklist</Text>
          </View>
          <View style={styles.progressCircle}>
            <Text style={[styles.progressPct, { color: progressColor }]}>
              {progressPct}%
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPct}%`, backgroundColor: progressColor },
            ]}
          />
        </View>

        <View style={styles.progressStats}>
          <Text style={styles.progressStatText}>
            ✓ {stats.completed} / {stats.total} tasks
          </Text>
          {stats.critical > 0 && (
            <Text style={styles.criticalWarning}>
              ⚠ {stats.critical} critical pending
            </Text>
          )}
        </View>
      </View>

      {/* Task Sections */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggle}
            onSaveNote={handleSaveNote}
          />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionCount}>
              {section.data.filter((t) => t.completed).length} / {section.data.length}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
        ListFooterComponent={
          <TouchableOpacity
            style={[
              styles.completeBtn,
              stats.percentage === 100 && styles.completeBtnReady,
            ]}
            onPress={handleMarkComplete}
          >
            <Ionicons name="checkmark-done-circle-outline" size={22} color={COLORS.black} />
            <Text style={styles.completeBtnText}>Mark Vehicle as Serviced</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  progressBanner: {
    backgroundColor: COLORS.surface,
    padding: 20,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressPlate: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPct: {
    fontSize: 14,
    fontWeight: '900',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStatText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  criticalWarning: {
    color: COLORS.warning,
    fontSize: 12,
    fontWeight: '600',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionCount: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  list: { padding: 16, paddingBottom: 48 },

  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  completeBtnReady: {
    backgroundColor: COLORS.primary,
    borderStyle: 'solid',
    borderColor: COLORS.primary,
  },
  completeBtnText: {
    color: COLORS.black,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ServiceChecklistScreen;