import React from 'react';
import {Card, Text} from 'react-native-paper';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const stepLabels = ['Survey Point', 'Common Details', 'Bird Records'];

const DraftCard = ({draft, onPress, onDelete}: {draft: any; onPress: () => void; onDelete: () => void}) => {
  const formData = draft.formData;
  const birdCount = formData?.birdDataArray?.length || 0;
  const lastModified = draft.lastModified
    ? new Date(draft.lastModified).toLocaleString()
    : '';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Icon name="file-document-edit-outline" size={36} color="#2e7d32" />
          </View>
          <View style={styles.headerText}>
            <View style={styles.titleRow}>
              <Text style={styles.habitatTitle}>
                {draft.habitatType || 'Untitled Draft'}
              </Text>
              <View style={styles.draftBadge}>
                <Icon name="pencil" size={14} color="#fff" />
                <Text style={styles.draftBadgeText}>Draft</Text>
              </View>
            </View>
            <Text style={styles.dateText}>
              {draft.date || 'No date set'}
            </Text>
            {draft.pointTag ? (
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{draft.pointTag}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Progress Info */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Icon name="progress-clock" size={16} color="#2e7d32" />
            <Text style={styles.progressLabel}>
              Step {(draft.currentStep || 0) + 1} of 3: {stepLabels[draft.currentStep || 0]}
            </Text>
          </View>
          {birdCount > 0 && (
            <View style={styles.progressRow}>
              <Icon name="bird" size={16} color="#2e7d32" />
              <Text style={styles.birdCountText}>
                {birdCount} bird observation{birdCount !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
          <Text style={styles.lastModifiedText}>Last edited: {lastModified}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editBtn} onPress={onPress} activeOpacity={0.7}>
            <Icon name="pencil" size={18} color="#fff" />
            <Text style={styles.editBtnText}>Continue Editing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} activeOpacity={0.7}>
            <Icon name="delete-outline" size={22} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 10,
    width: 70,
    height: 70,
    marginRight: 12,
  },
  placeholderAvatar: {
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitatTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
    color: '#1b5e20',
  },
  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  draftBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    color: '#2e7d32',
    marginTop: 2,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  progressSection: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '500',
  },
  birdCountText: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '500',
  },
  lastModifiedText: {
    fontSize: 11,
    color: '#4caf50',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    gap: 10,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#FFEBEE',
  },
});

export default DraftCard;
