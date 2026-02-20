import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { checkNetworkStatus, subscribeToNetworkChanges, syncFullBidirectional, getBirdPendingCount } from '../assets/sql_lite/sync_service';
import { getTotalPendingCount } from '../assets/sql_lite/db_connection';

interface NetworkStatusBannerProps {
  showSyncButton?: boolean;
  includeBirdSurveys?: boolean;
}

const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({ showSyncButton = true, includeBirdSurveys = false }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  useEffect(() => {
    // Check initial status
    checkNetworkStatus().then(setIsOnline);
    refreshPendingCount();

    // Subscribe to network changes
    const unsubscribe = subscribeToNetworkChanges((connected) => {
      setIsOnline(connected);
      if (connected) {
        refreshPendingCount();
      }
    });

    // Refresh pending count periodically
    const interval = setInterval(refreshPendingCount, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const refreshPendingCount = async () => {
    try {
      let count = await getTotalPendingCount();
      if (includeBirdSurveys) {
        const birdCount = await getBirdPendingCount();
        count += birdCount;
      }
      setPendingCount(count);
    } catch (error) {
      // silently handle
    }
  };

  const handleSync = useCallback(async () => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);
    setLastSyncResult(null);

    try {
      const result = await syncFullBidirectional();
      await refreshPendingCount();

      if (result.totalSynced > 0 && result.totalFailed === 0) {
        setLastSyncResult(`Synced ${result.totalSynced} items`);
      } else if (result.totalFailed > 0) {
        setLastSyncResult(`Synced ${result.totalSynced}, Failed ${result.totalFailed}`);
      } else {
        setLastSyncResult('All up to date');
      }
    } catch (error) {
      setLastSyncResult('Sync failed');
    } finally {
      setIsSyncing(false);
      // Clear result message after 3 seconds
      setTimeout(() => setLastSyncResult(null), 3000);
    }
  }, [isSyncing, isOnline]);

  return (
    <View style={styles.container}>
      {/* Online/Offline Status */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, isOnline ? styles.dotOnline : styles.dotOffline]} />
        <Text style={[styles.statusText, isOnline ? styles.textOnline : styles.textOffline]}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>

        {/* Cloud Sync Status */}
        <View style={styles.syncSection}>
          <Icon
            name={pendingCount > 0 ? 'cloud-upload' : 'cloud-done'}
            size={18}
            color={pendingCount > 0 ? '#F59E0B' : '#10B981'}
          />
          {pendingCount > 0 && (
            <Text style={styles.pendingText}>{pendingCount} pending</Text>
          )}
          {pendingCount === 0 && (
            <Text style={styles.syncedText}>Synced</Text>
          )}
        </View>

        {/* Sync Button */}
        {showSyncButton && isOnline && pendingCount > 0 && (
          <TouchableOpacity
            style={styles.syncButton}
            onPress={handleSync}
            disabled={isSyncing}
            activeOpacity={0.7}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="sync" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Sync result message */}
      {lastSyncResult && (
        <Text style={styles.syncResultText}>{lastSyncResult}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOnline: {
    backgroundColor: '#10B981',
  },
  dotOffline: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  textOnline: {
    color: '#10B981',
  },
  textOffline: {
    color: '#EF4444',
  },
  syncSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 8,
    gap: 4,
  },
  pendingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  syncedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  syncButton: {
    backgroundColor: '#4A7856',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncResultText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'right',
  },
});

export default NetworkStatusBanner;
