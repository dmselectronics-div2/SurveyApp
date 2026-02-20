import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getDatabase} from '../database/db';
import DraftCard from './draft-card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type FilterType = 'bird' | 'common' | 'survey';

const filterButtons: {key: FilterType; label: string; icon: string; color: string; bg: string}[] = [
  {key: 'bird', label: 'Bird Records', icon: 'bird', color: '#1B5E20', bg: '#E8F5E9'},
  {key: 'common', label: 'Common Details', icon: 'clipboard-text-outline', color: '#00695C', bg: '#E0F2F1'},
  {key: 'survey', label: 'Survey Points', icon: 'map-marker-outline', color: '#33691E', bg: '#F1F8E9'},
];

const CollectionPage = () => {
  const navigation = useNavigation<any>();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('bird');

  const loadDrafts = async () => {
    try {
      const db = await getDatabase();
      db.transaction((tx: any) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS bird_drafts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            draftId TEXT UNIQUE,
            habitatType TEXT,
            pointTag TEXT,
            date TEXT,
            lastModified TEXT,
            currentStep INTEGER DEFAULT 0,
            formData TEXT
          );`,
        );
        tx.executeSql(
          'SELECT * FROM bird_drafts ORDER BY lastModified DESC;',
          [],
          (_: any, results: any) => {
            const items: any[] = [];
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              items.push({
                ...row,
                formData: JSON.parse(row.formData),
              });
            }
            setDrafts(items);
          },
          (_: any, error: any) => {
            console.log('Error loading drafts:', error);
          },
        );
      });
    } catch (error) {
      console.error('loadDrafts error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDrafts();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDrafts();
    setRefreshing(false);
  };

  const handleDraftPress = (draft: any) => {
    navigation.navigate('BirdSurveyForm', {
      draftData: draft.formData,
      draftId: draft.draftId,
    });
  };

  const handleDeleteDraft = (draftId: string) => {
    Alert.alert('Delete Draft', 'Are you sure you want to delete this draft?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = await getDatabase();
            db.transaction((tx: any) => {
              tx.executeSql('DELETE FROM bird_drafts WHERE draftId = ?;', [draftId]);
            });
            loadDrafts();
          } catch (error) {
            console.error('Delete draft error:', error);
          }
        },
      },
    ]);
  };

  const birdRecordDrafts = drafts.filter(
    d => d.formData?.birdDataArray && d.formData.birdDataArray.length > 0,
  );
  const commonDetailDrafts = drafts.filter(
    d =>
      (!d.formData?.birdDataArray || d.formData.birdDataArray.length === 0) &&
      (d.currentStep || 0) >= 1,
  );
  const surveyPointDrafts = drafts.filter(
    d =>
      (!d.formData?.birdDataArray || d.formData.birdDataArray.length === 0) &&
      (d.currentStep || 0) === 0,
  );

  const getCounts = (key: FilterType) => {
    if (key === 'bird') return birdRecordDrafts.length;
    if (key === 'common') return commonDetailDrafts.length;
    return surveyPointDrafts.length;
  };

  const getFilteredDrafts = () => {
    if (activeFilter === 'bird') return birdRecordDrafts;
    if (activeFilter === 'common') return commonDetailDrafts;
    return surveyPointDrafts;
  };

  const filteredDrafts = getFilteredDrafts();
  const activeBtn = filterButtons.find(b => b.key === activeFilter)!;

  if (drafts.length === 0) {
    return (
      <ScrollView
        style={styles.pageBackground}
        contentContainerStyle={styles.emptyContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Icon name="file-document-edit-outline" size={60} color="#2e7d32" />
        <Text style={styles.emptyTitle}>No Drafts Yet</Text>
        <Text style={styles.emptySubtitle}>
          Incomplete surveys will be saved here as drafts
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.pageBackground}
      contentContainerStyle={styles.listContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {filterButtons.map(btn => {
          const isActive = activeFilter === btn.key;
          const count = getCounts(btn.key);
          return (
            <TouchableOpacity
              key={btn.key}
              onPress={() => setActiveFilter(btn.key)}
              activeOpacity={0.7}
              style={[
                styles.filterBtn,
                isActive
                  ? {backgroundColor: btn.color, borderColor: btn.color}
                  : {backgroundColor: btn.bg, borderColor: btn.bg},
              ]}>
              <View style={styles.filterBtnLeft}>
                <Icon
                  name={btn.icon}
                  size={18}
                  color={isActive ? '#fff' : btn.color}
                />
                <Text
                  style={[
                    styles.filterBtnText,
                    {color: isActive ? '#fff' : btn.color},
                  ]}>
                  {btn.label}
                </Text>
              </View>
              <View
                style={[
                  styles.filterCount,
                  {backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)'},
                ]}>
                <Text
                  style={[
                    styles.filterCountText,
                    {color: isActive ? '#fff' : btn.color},
                  ]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Icon name={activeBtn.icon} size={20} color={activeBtn.color} />
        <Text style={[styles.sectionTitle, {color: activeBtn.color}]}>
          {activeBtn.label} Drafts
        </Text>
      </View>

      {/* Draft Cards */}
      {filteredDrafts.length > 0 ? (
        filteredDrafts.map(draft => (
          <DraftCard
            key={draft.draftId}
            draft={draft}
            onPress={() => handleDraftPress(draft)}
            onDelete={() => handleDeleteDraft(draft.draftId)}
          />
        ))
      ) : (
        <View style={styles.emptySection}>
          <Icon name={activeBtn.icon} size={40} color="#ccc" />
          <Text style={styles.emptySectionText}>No {activeBtn.label.toLowerCase()} drafts</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    backgroundColor: '#ffffff',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  listContainer: {
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  pageBackground: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  filterContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  filterBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterCount: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    minWidth: 26,
    alignItems: 'center',
  },
  filterCountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b5e20',
    flex: 1,
  },
  emptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptySectionText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
});

export default CollectionPage;
