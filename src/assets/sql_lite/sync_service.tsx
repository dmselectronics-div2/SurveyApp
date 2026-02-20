import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import {
  getPendingRecords,
  markAsSynced,
  markAsFailed,
  getTotalPendingCount,
  getLoginEmail,
  setDashboardCache,
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
          updatedAt: plant.updated_at || new Date().toISOString(),
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
          updatedAt: animal.updated_at || new Date().toISOString(),
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
          updatedAt: nature.updated_at || new Date().toISOString(),
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
          updatedAt: activity.updated_at || new Date().toISOString(),
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
// BIRD SURVEY SYNC
// ============================================
import { getDatabase } from '../../bird-module/database/db';
import { API_URL } from '../../config';
import axiosMain from 'axios';

// Get count of pending bird surveys
export const getBirdPendingCount = (): Promise<number> => {
  return new Promise(async (resolve) => {
    try {
      const db = await getDatabase();
      db.transaction((tx: any) => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM bird_survey WHERE sync_status IN (?, ?)',
          ['pending', 'pending_update'],
          (_: any, results: any) => resolve(results.rows.item(0).count),
          () => { resolve(0); return false; },
        );
      });
    } catch {
      resolve(0);
    }
  });
};

// Sync pending bird surveys to server
export const syncBirdSurveys = async (): Promise<SyncResult> => {
  const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

  try {
    const db = await getDatabase();

    // Helper to get observations for a survey
    const getObservations = (tx: any, uniqueId: string): Promise<any[]> => {
      return new Promise((resolve) => {
        tx.executeSql(
          'SELECT * FROM bird_observations WHERE uniqueId = ?', [uniqueId],
          (_: any, obsResults: any) => {
            const obs = [];
            for (let j = 0; j < obsResults.rows.length; j++) {
              obs.push(obsResults.rows.item(j));
            }
            resolve(obs);
          },
          () => { resolve([]); return false; },
        );
      });
    };

    // Get all pending surveys
    const pendingSurveys: any[] = await new Promise((resolve) => {
      db.transaction((tx: any) => {
        tx.executeSql(
          'SELECT * FROM bird_survey WHERE sync_status IN (?, ?)',
          ['pending', 'pending_update'],
          (_: any, results: any) => {
            const rows = [];
            for (let i = 0; i < results.rows.length; i++) {
              rows.push(results.rows.item(i));
            }
            resolve(rows);
          },
          () => { resolve([]); return false; },
        );
      });
    });

    for (const row of pendingSurveys) {
      try {
        // Get observations in a separate transaction
        const observations: any[] = await new Promise((resolve) => {
          db.transaction((tx: any) => {
            getObservations(tx, row.uniqueId).then(resolve);
          });
        });

        const birdObservations = observations.map((obs: any) => ({
          uniqueId: obs.uniqueId, species: obs.species, count: obs.count,
          maturity: obs.maturity, sex: obs.sex, behaviour: obs.behaviour,
          identification: obs.identification, status: obs.status,
          latitude: row.latitude, longitude: row.longitude,
          weather: row.weather, waterConditions: row.water,
          remarks: obs.remarks, imageUri: obs.imageUri,
        }));

        const formData = {
          uniqueId: row.uniqueId, email: row.email, habitatType: row.habitatType,
          point: row.point, pointTag: row.pointTag, latitude: row.latitude,
          longitude: row.longitude, date: row.date, observers: row.observers,
          startTime: row.startTime, endTime: row.endTime, weather: row.weather,
          visibility: '', water: row.water, season: row.season,
          statusOfVegy: row.statusOfVegy, dominantVegetation: row.dominantVegetation || '',
          descriptor: row.descriptor, radiusOfArea: row.radiusOfArea,
          remark: row.remark, imageUri: row.imageUri, birdObservations,
        };

        if (row.sync_status === 'pending_update' && row.server_id) {
          // Update existing
          try {
            await axiosMain.put(`${API_URL}/form-entry/${row.server_id}`, formData);
            await new Promise<void>((resolve) => {
              db.transaction((tx: any) => {
                tx.executeSql('UPDATE bird_survey SET sync_status = ? WHERE uniqueId = ?',
                  ['synced', row.uniqueId], () => resolve(), () => { resolve(); return false; });
              });
            });
          } catch (updateError: any) {
            if (updateError.response?.status === 409) {
              // Conflict detected - mark as conflict
              await new Promise<void>((resolve) => {
                db.transaction((tx: any) => {
                  tx.executeSql('UPDATE bird_survey SET sync_status = ? WHERE uniqueId = ?',
                    ['conflict', row.uniqueId], () => resolve(), () => { resolve(); return false; });
                });
              });
              result.failed++;
              result.errors.push(`Bird survey ${row.uniqueId}: conflict - server has newer version`);
              continue;
            }
            throw updateError;
          }
        } else {
          // Create new
          try {
            const response = await axiosMain.post(`${API_URL}/form-entry`, formData);
            const addedId = response.data._id || response.data.formEntry?._id;
            await new Promise<void>((resolve) => {
              db.transaction((tx: any) => {
                tx.executeSql('UPDATE bird_survey SET sync_status = ?, server_id = ? WHERE uniqueId = ?',
                  ['synced', addedId || '', row.uniqueId], () => resolve(), () => { resolve(); return false; });
              });
            });
          } catch (createError: any) {
            if (createError.response?.status === 409) {
              // Conflict - survey already exists on server with newer data
              const serverId = createError.response?.data?._id || '';
              await new Promise<void>((resolve) => {
                db.transaction((tx: any) => {
                  tx.executeSql('UPDATE bird_survey SET sync_status = ?, server_id = ? WHERE uniqueId = ?',
                    ['conflict', serverId, row.uniqueId], () => resolve(), () => { resolve(); return false; });
                });
              });
              result.failed++;
              result.errors.push(`Bird survey ${row.uniqueId}: conflict - server has newer version`);
              continue;
            }
            throw createError;
          }
        }
        result.synced++;
      } catch (error: any) {
        result.failed++;
        result.errors.push(`Bird survey ${row.uniqueId}: ${error.message}`);
      }
    }
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Bird survey sync error: ${error.message}`);
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
    birdSurveys: SyncResult;
  };
}

// Sync all pending data
export const syncAllPendingData = async (): Promise<FullSyncResult> => {
  const isOnline = await checkNetworkStatus();

  const noConnection: SyncResult = { success: false, synced: 0, failed: 0, errors: ['No network connection'] };
  if (!isOnline) {
    return {
      success: false,
      totalSynced: 0,
      totalFailed: 0,
      results: {
        plants: noConnection, animals: noConnection,
        nature: noConnection, humanActivities: noConnection,
        birdSurveys: noConnection,
      },
    };
  }

  console.log('Starting sync of all pending data...');

  const plantsResult = await syncPlants();
  const animalsResult = await syncAnimals();
  const natureResult = await syncNature();
  const humanActivitiesResult = await syncHumanActivities();
  const birdSurveysResult = await syncBirdSurveys();

  const totalSynced = plantsResult.synced + animalsResult.synced + natureResult.synced + humanActivitiesResult.synced + birdSurveysResult.synced;
  const totalFailed = plantsResult.failed + animalsResult.failed + natureResult.failed + humanActivitiesResult.failed + birdSurveysResult.failed;

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
      birdSurveys: birdSurveysResult,
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
      syncInProgress = true;
      try {
        const citizenCount = await getTotalPendingCount();
        const birdCount = await getBirdPendingCount();
        const pendingCount = citizenCount + birdCount;
        if (pendingCount > 0) {
          console.log(`Network available. ${pendingCount} pending items to sync.`);
          await syncAllPendingData();
        }
        // Always try to download fresh data when coming online
        await syncDownloadBirdSurveys();
        await syncDownloadDashboardData();
      } catch (error) {
        console.log('Auto-sync error:', error);
      } finally {
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
// DOWNLOAD SYNC (CLOUD → LOCAL)
// ============================================

// Download bird surveys from server to local SQLite
export const syncDownloadBirdSurveys = async (): Promise<SyncResult> => {
  const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

  try {
    const email = await getLoginEmail();
    if (!email) return result;

    const db = await getDatabase();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const response = await axiosMain.get(`${API_URL}/form-entry`, {
      params: { email, since: thirtyDaysAgo.toISOString() },
    });

    const surveys = response.data?.formEntries || response.data || [];
    if (!Array.isArray(surveys)) return result;

    for (const survey of surveys) {
      try {
        const serverId = survey._id;
        // Check if already exists locally
        const exists: boolean = await new Promise((resolve) => {
          db.transaction((tx: any) => {
            tx.executeSql(
              'SELECT id FROM bird_survey WHERE server_id = ? OR uniqueId = ?',
              [serverId, survey.uniqueId || ''],
              (_: any, results: any) => resolve(results.rows.length > 0),
              () => { resolve(false); return false; },
            );
          });
        });

        if (exists) continue;

        // Insert into local DB
        await new Promise<void>((resolve) => {
          db.transaction((tx: any) => {
            tx.executeSql(
              `INSERT INTO bird_survey (email, uniqueId, habitatType, point, pointTag, latitude, longitude, date, observers, startTime, endTime, weather, water, season, statusOfVegy, dominantVegetation, descriptor, radiusOfArea, remark, imageUri, sync_status, server_id, updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [survey.email, survey.uniqueId, survey.habitatType, survey.point, survey.pointTag, survey.latitude, survey.longitude, survey.date, survey.observers, survey.startTime, survey.endTime, survey.weather, survey.water, survey.season, survey.statusOfVegy, survey.dominantVegetation || '', survey.descriptor || '', survey.radiusOfArea, survey.remark, survey.imageUri, 'synced', serverId, survey.updatedAt || new Date().toISOString(), survey.createdAt || new Date().toISOString()],
              () => resolve(),
              () => { resolve(); return false; },
            );

            // Also insert bird observations
            if (Array.isArray(survey.birdObservations)) {
              for (const obs of survey.birdObservations) {
                tx.executeSql(
                  `INSERT INTO bird_observations (uniqueId, species, count, maturity, sex, behaviour, identification, status, remarks, imageUri) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [survey.uniqueId, obs.species, obs.count, obs.maturity, obs.sex, obs.behaviour, obs.identification, obs.status, obs.remarks, obs.imageUri],
                );
              }
            }
          });
        });
        result.synced++;
      } catch (error: any) {
        result.failed++;
        result.errors.push(`Download bird survey: ${error.message}`);
      }
    }
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Bird download sync error: ${error.message}`);
  }

  return result;
};

// Download dashboard data and cache locally
export const syncDownloadDashboardData = async (): Promise<void> => {
  try {
    const email = await getLoginEmail();
    if (!email) return;

    // Cache bird stats
    try {
      const [speciesRes, statsRes] = await Promise.all([
        axiosMain.get(`${API_URL}/bird-species`),
        axiosMain.get(`${API_URL}/bird-stats`),
      ]);
      await setDashboardCache('bird_species', speciesRes.data);
      await setDashboardCache('bird_stats', statsRes.data);
    } catch (e) {
      console.log('Failed to cache bird dashboard data:', e);
    }

    // Cache citizen counts
    try {
      const citizenTypes = ['plants', 'animals', 'nature', 'human-activities'];
      for (const type of citizenTypes) {
        const res = await axios.get(`/citizen/${type}`, { params: { email } });
        await setDashboardCache(`citizen_${type}`, res.data);
      }
    } catch (e) {
      console.log('Failed to cache citizen dashboard data:', e);
    }

    console.log('Dashboard data cached for offline use');
  } catch (error) {
    console.error('Error syncing dashboard data:', error);
  }
};

// ============================================
// ENHANCED MAIN SYNC (Upload + Download)
// ============================================

// Full bidirectional sync
export const syncFullBidirectional = async (): Promise<FullSyncResult> => {
  // First upload pending data
  const uploadResult = await syncAllPendingData();

  // Then download from cloud if online
  if (uploadResult.success || uploadResult.totalSynced > 0) {
    try {
      await syncDownloadBirdSurveys();
      await syncDownloadDashboardData();
    } catch (error) {
      console.log('Download sync error (non-critical):', error);
    }
  }

  return uploadResult;
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
  syncBirdSurveys,
  getBirdPendingCount,
  syncAllPendingData,
  syncFullBidirectional,
  syncDownloadBirdSurveys,
  syncDownloadDashboardData,
  startAutoSync,
  stopAutoSync,
  isAutoSyncEnabled,
};
