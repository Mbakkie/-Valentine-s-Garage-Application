
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VEHICLE_CONDITIONS } from '../../constants/strings';
import { COLORS } from '../../constants/colors';

/**
 * @param {string}   value     - Currently selected condition value
 * @param {Function} onChange  - Called with selected condition value
 * @param {string}   [error]   - Validation error message
 */
const VehicleConditionPicker = ({ value, onChange, error }) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>VEHICLE CONDITION</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {VEHICLE_CONDITIONS.map((c) => {
        const selected = value === c.value;
        return (
          <TouchableOpacity
            key={c.value}
            style={[
              styles.pill,
              selected && { backgroundColor: c.color, borderColor: c.color },
            ]}
            onPress={() => onChange(c.value)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={c.icon}
              size={16}
              color={selected ? COLORS.white : c.color}
              style={styles.pillIcon}
            />
            <Text
              style={[
                styles.pillLabel,
                { color: selected ? COLORS.white : c.color },
              ]}
            >
              {c.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
    backgroundColor: COLORS.surfaceElevated,
  },
  pillIcon: {
    marginRight: 6,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
  },
});

export default VehicleConditionPicker;