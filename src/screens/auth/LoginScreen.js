import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';
import { validateEmail, validatePassword } from '../../utils/validators';
import { loginUser } from '../../services/authService';

const LoginScreen = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailErr = validateEmail(email);
    const passErr  = validatePassword(password);
    if (emailErr) newErrors.email    = emailErr;
    if (passErr)  newErrors.password = passErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
    } catch (err) {
      Alert.alert('Login Failed', STRINGS.loginFailed);
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
      >
        {/* Logo / Brand */}
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="construct" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>{STRINGS.appName}</Text>
          <Text style={styles.tagline}>{STRINGS.tagline}</Text>
        </View>

        {/* Decorative divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>STAFF LOGIN</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label={STRINGS.email}
            value={email}
            onChangeText={(t) => { setEmail(t); setErrors((e) => ({ ...e, email: undefined })); }}
            placeholder="mechanic@valentine.na"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input
            label={STRINGS.password}
            value={password}
            onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />

          <Button
            label={STRINGS.login}
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />
        </View>

        {/* Role hint */}
        <View style={styles.hintRow}>
          <View style={styles.hintBadge}>
            <Ionicons name="shield-checkmark-outline" size={13} color={COLORS.adminBadge} />
            <Text style={[styles.hintText, { color: COLORS.adminBadge }]}>Admin</Text>
          </View>
          <View style={styles.hintBadge}>
            <Ionicons name="hammer-outline" size={13} color={COLORS.mechanicBadge} />
            <Text style={[styles.hintText, { color: COLORS.mechanicBadge }]}>Mechanic</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Contact your system administrator if you need an account.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    color: COLORS.textDisabled,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginHorizontal: 12,
  },
  form: {
    marginBottom: 24,
  },
  loginBtn: {
    marginTop: 8,
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  hintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    color: COLORS.textDisabled,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;