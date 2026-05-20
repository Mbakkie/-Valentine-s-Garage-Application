
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import useAuth from '../hooks/useAuth';
import { COLORS } from '../constants/colors';

import LoginScreen from '../screens/auth/LoginScreen';
import VehicleListScreen from '../screens/mechanic/VehicleListScreen';
import CheckInScreen from '../screens/mechanic/CheckInScreen';
import ServiceChecklistScreen from '../screens/mechanic/ServiceChecklistScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';

const Stack = createNativeStackNavigator();

const defaultScreenOptions = {
  headerStyle: { backgroundColor: COLORS.surface },
  headerTintColor: COLORS.primary,
  headerTitleStyle: { color: COLORS.textPrimary, fontWeight: '700' },
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: COLORS.background },
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const MechanicStack = ({ user }) => (
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    <Stack.Screen
      name="VehicleList"
      component={VehicleListScreen}
      options={{ title: "Valentine's Garage", headerShown: false }}
      initialParams={{ user }}
    />
    <Stack.Screen
      name="CheckIn"
      component={CheckInScreen}
      options={{ title: 'Vehicle Check-In' }}
      initialParams={{ user }}
    />
    <Stack.Screen
      name="ServiceChecklist"
      component={ServiceChecklistScreen}
      options={({ route }) => ({
        title: route.params?.truckPlate || 'Service Checklist',
      })}
    />
  </Stack.Navigator>
);

const AdminStack = ({ user }) => (
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{ headerShown: false }}
      initialParams={{ user }}
    />
    <Stack.Screen
      name="Reports"
      component={ReportsScreen}
      options={{ title: 'Reports' }}
      initialParams={{ user }}
    />
    <Stack.Screen
      name="AdminVehicles"
      component={VehicleListScreen}
      options={{ title: 'Active Vehicles' }}
      initialParams={{ user }}
    />
    <Stack.Screen
      name="ServiceChecklist"
      component={ServiceChecklistScreen}
      options={({ route }) => ({
        title: route.params?.truckPlate || 'Checklist',
      })}
    />
    <Stack.Screen
      name="CheckIn"
      component={CheckInScreen}
      options={{ title: 'Vehicle Check-In' }}
      initialParams={{ user }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : profile?.role === 'admin' ? (
        <AdminStack user={profile} />
      ) : (
        <MechanicStack user={profile} />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;