import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import CollectionCard from './collection-card';
import { API_URL } from '../../config';
import { getDatabase } from '../database/db';

const executeSql = (db: any, sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        (_: any, results: any) => resolve(results),
        (_: any, error: any) => {
          console.log('SQL error:', error);
          reject(error);
        },
      );
    });
  });
};

const CollectionPage = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch cloud data
        let cloudEntries: any[] = [];
        try {
          const response = await fetch(`${API_URL}/form-entries`);
          const result = await response.json();
          if (Array.isArray(result)) {
            cloudEntries = result.map((e: any) => ({...e, syncStatus: 'cloud'}));
          }
        } catch (err) {
          console.log('Could not fetch cloud data:', err);
        }

        // Fetch local data from SQLite
        let localEntries: any[] = [];
        try {
          const db = await getDatabase();

          // Ensure tables exist
          await executeSql(db,
            `CREATE TABLE IF NOT EXISTS bird_survey (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              uniqueId TEXT, habitatType TEXT, point TEXT, pointTag TEXT,
              latitude TEXT, longitude TEXT, date TEXT, observers TEXT,
              startTime TEXT, endTime TEXT, weather TEXT, water TEXT,
              season TEXT, statusOfVegy TEXT, descriptor TEXT, radiusOfArea TEXT,
              remark TEXT, imageUri TEXT, teamMembers TEXT
            )`
          );
          await executeSql(db,
            `CREATE TABLE IF NOT EXISTS bird_observations (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              uniqueId TEXT, species TEXT, count TEXT, maturity TEXT,
              sex TEXT, behaviour TEXT, identification TEXT, status TEXT,
              remarks TEXT, imageUri TEXT
            )`
          );

          // Fetch all surveys
          const surveyResults = await executeSql(db, 'SELECT * FROM bird_survey ORDER BY id DESC');
          const surveys: any[] = [];
          for (let i = 0; i < surveyResults.rows.length; i++) {
            surveys.push(surveyResults.rows.item(i));
          }

          // Fetch all bird observations
          const birdResults = await executeSql(db, 'SELECT * FROM bird_observations');
          const allBirds: any[] = [];
          for (let i = 0; i < birdResults.rows.length; i++) {
            allBirds.push(birdResults.rows.item(i));
          }

          // Group birds by uniqueId
          const birdsByUniqueId: {[key: string]: any[]} = {};
          allBirds.forEach((bird: any) => {
            if (!birdsByUniqueId[bird.uniqueId]) {
              birdsByUniqueId[bird.uniqueId] = [];
            }
            birdsByUniqueId[bird.uniqueId].push(bird);
          });

          // Combine surveys with their bird observations
          localEntries = surveys.map((row: any) => ({
            ...row,
            teamMembers: row.teamMembers ? JSON.parse(row.teamMembers) : [],
            birdObservations: birdsByUniqueId[row.uniqueId] || [],
          }));

          console.log('Local entries found:', localEntries.length);
        } catch (err) {
          console.log('Could not fetch local data:', err);
        }

        // Build cloud uniqueId set
        const cloudIds = new Set(cloudEntries.map((e: any) => e.uniqueId));

        // Local-only entries (not in cloud)
        const localOnly = localEntries
          .filter((e: any) => !cloudIds.has(e.uniqueId))
          .map((e: any) => ({...e, syncStatus: 'local'}));

        // Merge: cloud entries first, then local-only
        const merged = [...cloudEntries, ...localOnly];
        setEntries(merged);
        console.log('Total entries:', merged.length, '(cloud:', cloudEntries.length, ', local-only:', localOnly.length, ')');
      } catch (error) {
        console.error('Error fetching data:', error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.title_container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Submissions Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your submitted surveys will appear here
            </Text>
          </View>
        ) : (
          entries.map((entry, index) => (
            <CollectionCard key={index} entry={entry} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title_container: {
    flex: 1,
    marginTop: '2%',
    marginBottom: '2%',
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CollectionPage;
