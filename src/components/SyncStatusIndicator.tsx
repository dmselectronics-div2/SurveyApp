import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export type SyncStatus = 'synced' | 'pending' | 'pending_update' | 'failed' | 'conflict' | 'local_only';

interface SyncStatusIndicatorProps {
  status: SyncStatus;
  showLabel?: boolean;
  size?: 'small' | 'medium';
}

const STATUS_CONFIG: Record<SyncStatus, { color: string; icon: string; label: string }> = {
  synced: { color: '#10B981', icon: 'cloud-done', label: 'Synced' },
  pending: { color: '#F59E0B', icon: 'cloud-upload', label: 'Pending' },
  pending_update: { color: '#F97316', icon: 'cloud-upload', label: 'Modified' },
  failed: { color: '#EF4444', icon: 'cloud-off', label: 'Failed' },
  conflict: { color: '#8B5CF6', icon: 'warning', label: 'Conflict' },
  local_only: { color: '#9CA3AF', icon: 'phone-android', label: 'Local' },
};

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  status,
  showLabel = false,
  size = 'small',
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.local_only;
  const dotSize = size === 'small' ? 10 : 14;
  const iconSize = size === 'small' ? 14 : 18;
  const fontSize = size === 'small' ? 10 : 12;

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: config.color }]} />
      {showLabel && (
        <View style={styles.labelRow}>
          <Icon name={config.icon} size={iconSize} color={config.color} />
          <Text style={[styles.label, { color: config.color, fontSize }]}>{config.label}</Text>
        </View>
      )}
    </View>
  );
};

export const SyncStatusLegend: React.FC = () => {
  return (
    <View style={styles.legendContainer}>
      {(Object.keys(STATUS_CONFIG) as SyncStatus[]).map((status) => (
        <View key={status} style={styles.legendItem}>
          <View
            style={[
              styles.dot,
              { width: 8, height: 8, borderRadius: 4, backgroundColor: STATUS_CONFIG[status].color },
            ]}
          />
          <Text style={styles.legendText}>{STATUS_CONFIG[status].label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {},
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontWeight: '600',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#6B7280',
  },
});

export default SyncStatusIndicator;
