import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import VehicleConditionPicker from '../../components/checkin/VehicleConditionPicker';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';
import { validateCheckInForm, isFormValid } from '../../utils/validators';
import { createCheckIn } from '../../services/vehicleService';

const CheckInScreen = ({ navigation, route }) => {
  const { user } = route.params || {};

  const [form, setForm] = useState({
    truckPlate: '',
    truckModel: '',
    odometerReading: '',
    condition: '',
    driverName: '',
    notes: '',
  });
  const [errors, setErrors]   = useState({});
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to capture vehicle photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    const errs = validateCheckInForm(form);
    if (!isFormValid(errs)) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const checkInId = await createCheckIn(
        {
          ...form,
          checkedInByUid:  user?.uid  || 'unknown',
          checkedInByName: user?.name || 'Unknown',
        },
        photoUri
      );

      Alert.alert(
        'Check-In Successful',
        `${form.truckPlate.toUpperCase()} has been checked in.`,
        [
          {
            text: 'Open Checklist',
            onPress: () =>
              navigation.navigate('ServiceChecklist', {
                checkInId,
                truckPlate: form.truckPlate.toUpperCase(),
                user,
              }),
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', STRINGS.genericError);
      console.error('CheckIn error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{STRINGS.checkIn}</Text>
          <Text style={styles.subtitle}>{STRINGS.checkInSubtitle}</Text>
        </View>

        {/* Form */}
        <Input
          label={STRINGS.truckPlate}
          value={form.truckPlate}
          onChangeText={(v) => updateField('truckPlate', v)}
          placeholder="e.g. N 123-456 WB"
          autoCapitalize="characters"
          error={errors.truckPlate}
        />

        <Input
          label={STRINGS.truckModel}
          value={form.truckModel}
          onChangeText={(v) => updateField('truckModel', v)}
          placeholder="e.g. Mercedes Actros 2644"
          error={errors.truckModel}
        />

        <Input
          label={STRINGS.kilometersDriven}
          value={form.odometerReading}
          onChangeText={(v) => updateField('odometerReading', v)}
          placeholder="e.g. 145000"
          keyboardType="numeric"
          error={errors.odometerReading}
        />

        <VehicleConditionPicker
          value={form.condition}
          onChange={(v) => updateField('condition', v)}
          error={errors.condition}
        />

        <Input
          label={STRINGS.driverName}
          value={form.driverName}
          onChangeText={(v) => updateField('driverName', v)}
          placeholder="e.g. John Shikongo"
        />

        <Input
          label={STRINGS.notes}
          value={form.notes}
          onChangeText={(v) => updateField('notes', v)}
          placeholder="Visible damage, noises, customer complaints…"
          multiline
          numberOfLines={3}
        />

        {/* Photo Evidence */}
        <Text style={styles.sectionLabel}>{STRINGS.photoEvidence}</Text>
        {photoUri ? (
          <View style={styles.photoPreview}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removePhoto}
              onPress={() => setPhotoUri(null)}
            >
              <Ionicons name="close-circle" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoBtn} onPress={handleCamera}>
              <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
              <Text style={styles.photoBtnText}>{STRINGS.takePhoto}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={handleGallery}>
              <Ionicons name="images-outline" size={20} color={COLORS.primary} />
              <Text style={styles.photoBtnText}>{STRINGS.choosePhoto}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Button
          label={STRINGS.submitCheckIn}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 48 },
  header: { marginBottom: 24 },
  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    paddingVertical: 16,
  },
  photoBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  photoPreview: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removePhoto: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  submitBtn: { marginTop: 8 },
});

export default CheckInScreen;