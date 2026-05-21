import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import VehicleCard from '../../components/checkin/VehicleCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useVehicles from '../../hooks/useVehicle';
import { COLORS } from '../../constants/colors';

const VehicleListScreen = ({ navigation, route }) => {
  const { user } = route.params || {};
  const { vehicles, loading } = useVehicles();

  if (loading) return <LoadingSpinner message="Loading vehicles…" />;

  const handleCardPress = (checkIn) => {
    navigation.navigate('ServiceChecklist', {
      checkInId: checkIn.id,
      truckPlate: checkIn.truckPlate,
      user,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Page Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hi, {user?.name?.split(' ')[0] || 'Mechanic'} 👋
          </Text>
          <Text style={styles.title}>Active Vehicles</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{vehicles.length}</Text>
        </View>
      </View>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VehicleCard checkIn={item} onPress={() => handleCardPress(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="car-outline" size={64} color={COLORS.textDisabled} />
            <Text style={styles.emptyTitle}>No Active Vehicles</Text>
            <Text style={styles.emptyText}>
              Check in a truck to get started.
            </Text>
          </View>
        }
      />

      {/* FAB — Check In */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CheckIn', { user })}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={COLORS.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  countBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: COLORS.black,
    fontWeight: '900',
    fontSize: 18,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
});

export default VehicleListScreen;