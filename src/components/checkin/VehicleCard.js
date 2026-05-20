
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { VEHICLE_CONDITIONS } from '../../constants/strings';
import { formatDate, formatOdometer } from '../../utils/formatters';

const conditionColor = (val) =>
  (VEHICLE_CONDITIONS.find((c) => c.value === val) || {}).color || COLORS.textSecondary;

/**
 * @param {object}   checkIn   - Check-in document
 * @param {Function} onPress   - Navigate to checklist
 */
const VehicleCard = ({ checkIn, onPress }) => {
  const color = conditionColor(checkIn.condition);
  const completed = checkIn.status === 'completed';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.plateContainer}>
          <Ionicons name="car-sport-outline" size={18} color={COLORS.primary} />
          <Text style={styles.plate}>{checkIn.truckPlate}</Text>
        </View>
        <View style={[styles.statusBadge, { borderColor: color }]}>
          <View style={[styles.statusDot, { backgroundColor: color }]} />
          <Text style={[styles.statusText, { color }]}>
            {checkIn.condition?.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Model + odometer */}
      <Text style={styles.model}>{checkIn.truckModel}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="speedometer-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{formatOdometer(checkIn.odometerReading)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{formatDate(checkIn.checkInTime)}</Text>
        </View>
      </View>

      {/* Driver */}
      {checkIn.driverName ? (
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{checkIn.driverName}</Text>
        </View>
      ) : null}

      {/* CTA */}
      <View style={styles.footer}>
        <Text style={styles.cta}>
          {completed ? 'View Report' : 'Open Checklist'}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  plateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plate: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  model: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    gap: 4,
  },
  cta: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },
});

export default VehicleCard;