import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

// Camera permission uses React Native's PermissionsAndroid rather than
// expo-camera: we only need the permission, not the camera UI, and the legacy
// expo-camera native module pulls a dependency (cameraview) that no longer
// resolves since JCenter shut down.
async function getCameraPermission(): Promise<PermissionState> {
  if (Platform.OS !== 'android') return 'undetermined';
  const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
  return granted ? 'granted' : 'undetermined';
}

async function requestCameraPermission(): Promise<PermissionState> {
  if (Platform.OS !== 'android') return 'undetermined';
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
  return 'denied';
}

export type PermissionKey = 'notifications' | 'location' | 'camera';
export type PermissionState = 'granted' | 'denied' | 'undetermined';

const ASKED_FLAG = 'perms:initialRequested';

export const PERMISSION_META: {
  key: PermissionKey;
  label: string;
  description: string;
  icon: 'notifications-outline' | 'location-outline' | 'camera-outline';
}[] = [
  {
    key: 'notifications',
    label: 'Notifications',
    description: 'Trial invites, messages and connection updates.',
    icon: 'notifications-outline',
  },
  {
    key: 'location',
    label: 'Location',
    description: 'Show nearby academies, trials and events.',
    icon: 'location-outline',
  },
  {
    key: 'camera',
    label: 'Camera',
    description: 'Capture profile photos and highlight clips.',
    icon: 'camera-outline',
  },
];

function normalize(status: string, granted?: boolean): PermissionState {
  if (granted || status === 'granted') return 'granted';
  if (status === 'undetermined') return 'undetermined';
  return 'denied';
}

export async function getPermission(key: PermissionKey): Promise<PermissionState> {
  try {
    if (key === 'notifications') {
      const r = await Notifications.getPermissionsAsync();
      return normalize(r.status, r.granted);
    }
    if (key === 'location') {
      const r = await Location.getForegroundPermissionsAsync();
      return normalize(r.status, r.granted);
    }
    return getCameraPermission();
  } catch {
    return 'undetermined';
  }
}

export async function requestPermission(key: PermissionKey): Promise<PermissionState> {
  try {
    if (key === 'notifications') {
      const r = await Notifications.requestPermissionsAsync();
      return normalize(r.status, r.granted);
    }
    if (key === 'location') {
      const r = await Location.requestForegroundPermissionsAsync();
      return normalize(r.status, r.granted);
    }
    return requestCameraPermission();
  } catch {
    return 'denied';
  }
}

export async function getAllPermissions(): Promise<Record<PermissionKey, PermissionState>> {
  const [notifications, location, camera] = await Promise.all([
    getPermission('notifications'),
    getPermission('location'),
    getPermission('camera'),
  ]);
  return { notifications, location, camera };
}

/**
 * On first launch, request the three permissions once and remember that we did.
 * Subsequent launches won't re-prompt (the OS also suppresses repeat prompts).
 */
export async function ensureInitialPermissions(): Promise<void> {
  try {
    const asked = await AsyncStorage.getItem(ASKED_FLAG);
    if (asked) return;
    // Sequential so each native dialog is shown one at a time.
    await requestPermission('notifications');
    await requestPermission('location');
    await requestPermission('camera');
    await AsyncStorage.setItem(ASKED_FLAG, new Date().toISOString());
  } catch {
    // best-effort — never block app start on permissions
  }
}
