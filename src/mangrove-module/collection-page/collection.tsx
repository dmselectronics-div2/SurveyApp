import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getDatabase} from '../../bird-module/database/db';
import ByvalviDraftCard from './draft-card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ByvalviCollection = () => {
  const navigation = useNavigation<any>();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDrafts = async () => {
    try {
      const db = await getDatabase();
      db.transaction((tx: any) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS bivalvi_drafts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            draftId TEXT UNIQUE,
            location TEXT,
            date TEXT,
            lastModified TEXT,
            formData TEXT
          );`,
        );
        tx.executeSql(
          'SELECT * FROM bivalvi_drafts ORDER BY lastModified DESC;',
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
            console.log('Error loading bivalvi drafts:', error);
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
    navigation.navigate('MangroveNew', {
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
              tx.executeSql('DELETE FROM bivalvi_drafts WHERE draftId = ?;', [draftId]);
            });
            loadDrafts();
          } catch (error) {
            console.error('Delete draft error:', error);
          }
        },
      },
    ]);
  };

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

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Icon name="file-document-edit-outline" size={20} color="#1b5e20" />
        <Text style={styles.sectionTitle}>
          Survey Drafts ({drafts.length})
        </Text>
      </View>

      {/* Draft Cards */}
      {drafts.map(draft => (
        <ByvalviDraftCard
          key={draft.draftId}
          draft={draft}
          onPress={() => handleDraftPress(draft)}
          onDelete={() => handleDeleteDraft(draft.draftId)}
        />
      ))}
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
});

export default ByvalviCollection;
