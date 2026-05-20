import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { COLORS } from '../../constants/colors';
import { getDashboardSummary } from '../../services/reportService';
import { logoutUser } from '../../services/authService';
import { formatDate } from '../../utils/formatters';

const StatCard = ({ icon, label, value, color }) => (
  <View style={[styles.statCard, { borderTopColor: color }]}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AdminDashboardScreen = ({ navigation, route }) => {
  const { user } = route.params || {};
  const [summary, setSummary] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleLogout = async () => {
    await logoutUser();
  };

  if (loading) return <LoadingSpinner message="Loading dashboard…" />;

  const quickTiles = [
    {
      icon: 'car-sport-outline',
      label: 'Active Vehicles',
      desc: 'Vehicles currently in service',
      color: COLORS.info,
      onPress: () => navigation.navigate('AdminVehicles', { user }),
    },
    {
      icon: 'bar-chart-outline',
      label: 'Employee Reports',
      desc: 'View mechanic activity',
      color: COLORS.primary,
      onPress: () => navigation.navigate('Reports', { user }),
    },
    {
      icon: 'document-text-outline',
      label: 'All Check-Ins',
      desc: 'Full vehicle history log',
      color: COLORS.success,
      onPress: () => navigation.navigate('Reports', { user, tab: 'vehicles' }),
    },
  ];

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); load(); }}
          tintColor={COLORS.primary}
        />
      }
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.adminName}>{user?.name || 'Valentine'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Date */}
      <Text style={styles.dateText}>{formatDate(new Date())}</Text>

      {/* Stats Row */}
      <Text style={styles.sectionTitle}>Today at a Glance</Text>
      <View style={styles.statsRow}>
        <StatCard
          icon="car-outline"
          label="Total Check-Ins"
          value={summary?.totalCheckIns ?? 0}
          color={COLORS.info}
        />
        <StatCard
          icon="construct-outline"
          label="Active Now"
          value={summary?.activeVehicles ?? 0}
          color={COLORS.warning}
        />
        <StatCard
          icon="checkmark-done-outline"
          label="Completed Today"
          value={summary?.completedToday ?? 0}
          color={COLORS.success}
        />
      </View>

      {/* Quick Access */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      {quickTiles.map((tile) => (
        <TouchableOpacity
          key={tile.label}
          style={styles.tile}
          onPress={tile.onPress}
          activeOpacity={0.8}
        >
          <View style={[styles.tileIcon, { backgroundColor: tile.color + '22' }]}>
            <Ionicons name={tile.icon} size={24} color={tile.color} />
          </View>
          <View style={styles.tileText}>
            <Text style={styles.tileLabel}>{tile.label}</Text>
            <Text style={styles.tileDesc}>{tile.desc}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingTop: 56, paddingBottom: 48 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  greeting: { color: COLORS.textSecondary, fontSize: 14 },
  adminName: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '800' },
  logoutBtn: {
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    color: COLORS.textDisabled,
    fontSize: 12,
    marginBottom: 28,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: { fontSize: 28, fontWeight: '900', marginTop: 6 },
  statLabel: { color: COLORS.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 2 },

  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tileText: { flex: 1 },
  tileLabel: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15 },
  tileDesc: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
});

export default AdminDashboardScreen;