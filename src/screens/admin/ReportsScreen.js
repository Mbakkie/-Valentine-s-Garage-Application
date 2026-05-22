
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import { COLORS } from '../../constants/colors';
import { getEmployeeActivityReport } from '../../services/reportService';
import { getAllCheckIns as fetchAllCheckIns } from '../../services/vehicleService';
import { formatDate, formatOdometer } from '../../utils/formatters';
import { VEHICLE_CONDITIONS } from '../../constants/strings';

const Tab = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.activeTab]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
  </TouchableOpacity>
);

const ConditionBadge = ({ condition }) => {
  const c = VEHICLE_CONDITIONS.find((v) => v.value === condition);
  if (!c) return null;
  return (
    <View style={[styles.badge, { borderColor: c.color }]}>
      <Text style={[styles.badgeText, { color: c.color }]}>
        {c.label.toUpperCase()}
      </Text>
    </View>
  );
};

const EmployeeReport = ({ data }) => {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No employee activity recorded yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.reportScroll}>
      {entries.map(([uid, emp]) => (
        <Card key={uid}>
          <View style={styles.empHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {emp.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.empName}>{emp.name}</Text>
              <Text style={styles.empSub}>Mechanic</Text>
            </View>
            <View style={styles.taskCount}>
              <Text style={styles.taskCountNum}>{emp.tasksCompleted}</Text>
              <Text style={styles.taskCountLabel}>tasks</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.vehicleHeading}>Vehicles worked on:</Text>
          <View style={styles.plateList}>
            {emp.vehiclesWorkedOn.map((plate) => (
              <View key={plate} style={styles.plateBadge}>
                <Ionicons name="car-outline" size={12} color={COLORS.primary} />
                <Text style={styles.plateText}>{plate}</Text>
              </View>
            ))}
          </View>
        </Card>
      ))}
    </ScrollView>
  );
};

const VehicleHistoryReport = ({ data }) => {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No check-ins recorded yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.reportScroll}
      renderItem={({ item }) => (
        <Card>
          <View style={styles.vhHeader}>
            <Text style={styles.vhPlate}>{item.truckPlate}</Text>
            <ConditionBadge condition={item.condition} />
          </View>

          <Text style={styles.vhModel}>{item.truckModel}</Text>

          <View style={styles.vhMeta}>
            <View style={styles.vhMetaItem}>
              <Ionicons name="speedometer-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.vhMetaText}>{formatOdometer(item.odometerReading)}</Text>
            </View>
            <View style={styles.vhMetaItem}>
              <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.vhMetaText}>{formatDate(item.checkInTime)}</Text>
            </View>
          </View>

          {item.driverName ? (
            <Text style={styles.vhDriver}>Driver: {item.driverName}</Text>
          ) : null}

          {item.notes ? (
            <Text style={styles.vhNotes}>📝 {item.notes}</Text>
          ) : null}

          {item.checkedInByName ? (
            <Text style={styles.vhCheckedBy}>
              Checked in by: {item.checkedInByName}
            </Text>
          ) : null}
        </Card>
      )}
    />
  );
};

const ReportsScreen = ({ route }) => {
  const initialTab = route?.params?.tab === 'vehicles' ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [empData, setEmpData]     = useState({});
  const [vhData, setVhData]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [emp, vh] = await Promise.all([
        getEmployeeActivityReport(),
        fetchAllCheckIns(),
      ]);
      setEmpData(emp);
      setVhData(vh);
    } catch (err) {
      console.error('Report load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>Employee & vehicle activity</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Tab
          label="Employee Activity"
          active={activeTab === 0}
          onPress={() => setActiveTab(0)}
        />
        <Tab
          label="Vehicle History"
          active={activeTab === 1}
          onPress={() => setActiveTab(1)}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ marginTop: 40 }}
          size="large"
        />
      ) : activeTab === 0 ? (
        <EmployeeReport data={empData} />
      ) : (
        <VehicleHistoryReport data={vhData} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '800' },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, marginTop: 2 },

  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.primary,
  },

  reportScroll: { padding: 16, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },

  // Employee card
  empHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: COLORS.black, fontWeight: '900', fontSize: 18 },
  empName: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  empSub: { color: COLORS.textSecondary, fontSize: 12 },
  taskCount: { alignItems: 'center' },
  taskCountNum: { color: COLORS.primary, fontSize: 24, fontWeight: '900' },
  taskCountLabel: { color: COLORS.textSecondary, fontSize: 11 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 10 },
  vehicleHeading: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 8 },
  plateList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  plateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  plateText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },

  vhHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vhPlate: { color: COLORS.primary, fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },
  vhModel: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  vhMeta: { flexDirection: 'row', gap: 16, marginBottom: 4 },
  vhMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vhMetaText: { color: COLORS.textSecondary, fontSize: 12 },
  vhDriver: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  vhNotes: { color: COLORS.textSecondary, fontSize: 12, fontStyle: 'italic', marginTop: 4 },
  vhCheckedBy: { color: COLORS.textDisabled, fontSize: 11, marginTop: 6 },
});

export default ReportsScreen;