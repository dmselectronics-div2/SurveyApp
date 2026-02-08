import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import {
  getPendingRecords,
  markAsSynced,
  markAsFailed,
  getTotalPendingCount,
} from './db_connection';
import axios from '../../citizen-module/api/axios';

// ============================================
// NETWORK STATUS
// ============================================

export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.isInternetReachable === true;
  } catch (error) {
    console.error('Error checking network status:', error);
    return false;
  }
};

// Subscribe to network changes
export const subscribeToNetworkChanges = (
  callback: (isConnected: boolean) => void
): (() => void) => {
  const unsubscribe = NetInfo.addEventListener(state => {
    const isConnected = state.isConnected === true && state.isInternetReachable === true;
    callback(isConnected);
  });
  return unsubscribe;
};

// ============================================
// IMAGE HANDLING
// ============================================

// Convert image file to base64
export const imageToBase64 = async (imagePath: string): Promise<string | null> => {
  try {
    if (!imagePath) return null;

    // Remove file:// prefix if present
    const cleanPath = imagePath.replace('file://', '');

    // Check if file exists
    const exists = await RNFS.exists(cleanPath);
    if (!exists) {
      console.warn('Image file does not exist:', cleanPath);
      return null;
    }

    // Read file as base64
    const base64 = await RNFS.readFile(cleanPath, 'base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

// ============================================
// SYNC FUNCTIONS
// ============================================

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

// Sync plants to server
export const syncPlants = async (): Promise<SyncResult> => {
  const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

  try {
    const pendingPlants = await getPendingRecords('plants');

    for (const plant of pendingPlants) {
      try {
        // Convert image to base64 if needed
        let photoData = plant.photo_base64;
        if (!photoData && plant.photo) {
          photoData = await imageToBase64(plant.photo);
        }

        const payload = {
          plantType: plant.plant_type,
          photo: photoData,
          date: plant.date,
          timeOfDay: plant.time_of_day,
          description: plant.description,
          latitude: plant.latitude,
          longitude: plant.longitude,
          contactInfo: plant.contact_info,
          canUsePhoto: plant.can_use_photo === 1,
          photoCredit: plant.photo_credit,
        };

        const response = await axios.post('/citizen/plants', payload);

        if (response.data && response.data._id) {
          await markAsSynced('plants', plant.id, response.data._id);
          result.synced++;
        }
      } catch (error: any) {
        await markAsFailed('plants', plant.id, error.message || 'Unknown error');
        result.failed++;
        result.errors.push(`Plant ${plant.id}: ${error.message}`);
      }
    }
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Plants sync error: ${error.message}`);
  }

  return result;
};

// Sync animals to server
export const syncAnimals = async (): Promise<SyncResult> => {
  const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

  try {
    const pendingAnimals = await getPendingRecords('animals');

    for (const animal of pendingAnimals) {
      try {
        let photoData = animal.photo_base64;
        if (!photoData && animal.photo) {
          photoData = await imageToBase64(animal.photo);
        }

        const payload = {
          animalType: animal.animal_type,
          photo: photoData,
          date: animal.date,
          timeOfDay: animal.time_of_day,
          description: animal.description,
          latitude: animal.latitude,
          longitude: animal.longitude,
          contactInfo: animal.contact_info,
          canUsePhoto: animal.can_use_photo === 1,
          photoCredit: animal.photo_credit,
        };

        const response = await axios.post('/citizen/animals', payload);

        if (response.data && response.data._id) {
          await markAsSynced('animals', animal.id, response.data._id);
          result.synced++;
        }
      } catch (error: any) {
        await markAsFailed('animals', animal.id, error.message || 'Unknown error');
        result.failed++;
        result.errors.push(`Animal ${animal.id}: ${error.message}`);
      }
    }
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Animals sync error: ${error.message}`);
  }

  return result;
};

// Sync nature observations to server
export const syncNature = async (): Promise<SyncResult> => {
  const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

  try {
    const pendingNature = await getPendingRecords('nature');

    for (const nature of pendingNature) {
      try {
        let photoData = nature.photo_base64;
        if (!photoData && nature.photo) {
          photoData = await imageToBase64(nature.photo);
        }

        const payload = {
          natureType: nature.nature_type,
          photo: photoData,
          date: nature.date,
          timeOfDay: nature.time_of_day,
          description: nature.description,
          latitude: nature.latitude,
          longitude: nature.longitude,
          contactInfo: nature.contact_info,
          canUsePhoto: nature.can_use_photo === 1,
          photoCredit: nature.photo_credit,
        };

        const response = await axios.post('/citizen/nature', payload);

        if (response.data && response.data._id) {
          await markAsSynced('nature', nature.id, response.data._id);
          result.synced++;
        }
      } catch (error: any) {
        await markAsFailed('nature', nature.id, error.message || 'Unknown error');
        result.failed++;
        result.errors.push(`Nature ${nature.id}: ${error.message}`);
      }
    }
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Nature sync error: ${error.message}`);
  }

  return result;
};

// Sync human activities to server
export const syncHumanActivities = async (): Promise<SyncResult> => {
  const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

  try {
    const pendingActivities = await getPendingRecords('human_activities');

    for (const activity of pendingActivities) {
      try {
        let photoData = activity.photo_base64;
        if (!photoData && activity.photo) {
          photoData = await imageToBase64(activity.photo);
        }

        const payload = {
          activityType: activity.activity_type,
          photo: photoData,
          date: activity.date,
          timeOfDay: activity.time_of_day,
          description: activity.description,
          latitude: activity.latitude,
          longitude: activity.longitude,
          contactInfo: activity.contact_info,
          canUsePhoto: activity.can_use_photo === 1,
          photoCredit: activity.photo_credit,
        };

        const response = await axios.post('/citizen/human-activities', payload);

        if (response.data && response.data._id) {
          await markAsSynced('human_activities', activity.id, response.data._id);
          result.synced++;
        }
      } catch (error: any) {
        await markAsFailed('human_activities', activity.id, error.message || 'Unknown error');
        result.failed++;
        result.errors.push(`HumanActivity ${activity.id}: ${error.message}`);
      }
    }
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Human activities sync error: ${error.message}`);
  }

  return result;
};

// ============================================
// MAIN SYNC FUNCTION
// ============================================

export interface FullSyncResult {
  success: boolean;
  totalSynced: number;
  totalFailed: number;
  results: {
    plants: SyncResult;
    animals: SyncResult;
    nature: SyncResult;
    humanActivities: SyncResult;
  };
}

// Sync all pending data
export const syncAllPendingData = async (): Promise<FullSyncResult> => {
  const isOnline = await checkNetworkStatus();

  if (!isOnline) {
    return {
      success: false,
      totalSynced: 0,
      totalFailed: 0,
      results: {
        plants: { success: false, synced: 0, failed: 0, errors: ['No network connection'] },
        animals: { success: false, synced: 0, failed: 0, errors: ['No network connection'] },
        nature: { success: false, synced: 0, failed: 0, errors: ['No network connection'] },
        humanActivities: { success: false, synced: 0, failed: 0, errors: ['No network connection'] },
      },
    };
  }

  console.log('Starting sync of all pending data...');

  const plantsResult = await syncPlants();
  const animalsResult = await syncAnimals();
  const natureResult = await syncNature();
  const humanActivitiesResult = await syncHumanActivities();

  const totalSynced = plantsResult.synced + animalsResult.synced + natureResult.synced + humanActivitiesResult.synced;
  const totalFailed = plantsResult.failed + animalsResult.failed + natureResult.failed + humanActivitiesResult.failed;

  console.log(`Sync complete. Synced: ${totalSynced}, Failed: ${totalFailed}`);

  return {
    success: totalFailed === 0,
    totalSynced,
    totalFailed,
    results: {
      plants: plantsResult,
      animals: animalsResult,
      nature: natureResult,
      humanActivities: humanActivitiesResult,
    },
  };
};

// ============================================
// AUTO SYNC MANAGER
// ============================================

let autoSyncEnabled = false;
let syncInProgress = false;
let networkUnsubscribe: (() => void) | null = null;

// Start auto-sync (syncs when network becomes available)
export const startAutoSync = (): void => {
  if (autoSyncEnabled) return;

  autoSyncEnabled = true;

  networkUnsubscribe = subscribeToNetworkChanges(async (isConnected) => {
    if (isConnected && !syncInProgress) {
      const pendingCount = await getTotalPendingCount();
      if (pendingCount > 0) {
        console.log(`Network available. ${pendingCount} pending items to sync.`);
        syncInProgress = true;
        await syncAllPendingData();
        syncInProgress = false;
      }
    }
  });

  console.log('Auto-sync started');
};

// Stop auto-sync
export const stopAutoSync = (): void => {
  autoSyncEnabled = false;

  if (networkUnsubscribe) {
    networkUnsubscribe();
    networkUnsubscribe = null;
  }

  console.log('Auto-sync stopped');
};

// Check if auto-sync is enabled
export const isAutoSyncEnabled = (): boolean => {
  return autoSyncEnabled;
};

// ============================================
// UTILITY EXPORTS
// ============================================

export default {
  checkNetworkStatus,
  subscribeToNetworkChanges,
  imageToBase64,
  syncPlants,
  syncAnimals,
  syncNature,
  syncHumanActivities,
  syncAllPendingData,
  startAutoSync,
  stopAutoSync,
  isAutoSyncEnabled,
};
