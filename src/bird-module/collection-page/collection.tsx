import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

// Dummy data for demonstration
const getDummyCollectionData = () => {
  return [
    {
      id: 1,
      uniqueId: 'survey_001',
      habitatType: 'Wetland',
      point: 'Point A',
      pointTag: 'Coastal Marsh',
      latitude: '6.9271',
      longitude: '80.7789',
      date: '2024-02-10',
      observers: 'John Smith, Sarah Johnson',
      startTime: '06:00 AM',
      endTime: '09:30 AM',
      weather: 'Sunny',
      water: 'Fresh',
      season: 'Winter',
      statusOfVegy: 'Dense',
      descriptor: 'Well maintained wetland area',
      radiusOfArea: '500m',
      remark: 'Excellent bird diversity observed',
      imageUri: null,
      teamMembers: ['John Smith', 'Sarah Johnson'],
      birdObservations: [
        {
          id: 1,
          uniqueId: 'survey_001',
          species: 'Common Moorhen (Gallinula chloropus)',
          count: '8',
          maturity: 'Adult',
          sex: 'Mixed',
          behaviour: 'Foraging',
          identification: 'Clear',
          status: 'Resident',
          remarks: 'Active around reeds',
          imageUri: null,
        },
        {
          id: 2,
          uniqueId: 'survey_001',
          species: 'Purple Heron (Ardea purpurea)',
          count: '3',
          maturity: 'Adult',
          sex: 'Male',
          behaviour: 'Hunting',
          identification: 'Confirmed',
          status: 'Migrant',
          remarks: 'Spotted in shallow water',
          imageUri: null,
        },
        {
          id: 3,
          uniqueId: 'survey_001',
          species: 'Great Cormorant (Phalacrocorax carbo)',
          count: '5',
          maturity: 'Mixed',
          sex: 'Female',
          behaviour: 'Resting',
          identification: 'Clear',
          status: 'Winter Visitor',
          remarks: 'Perched on dead trees',
          imageUri: null,
        },
      ],
      syncStatus: 'cloud',
    },
    {
      id: 2,
      uniqueId: 'survey_002',
      habitatType: 'Forest',
      point: 'Point B',
      pointTag: 'Dense Forest',
      latitude: '7.0896',
      longitude: '80.6270',
      date: '2024-02-09',
      observers: 'Mike Chen',
      startTime: '07:15 AM',
      endTime: '11:00 AM',
      weather: 'Cloudy',
      water: 'Fresh',
      season: 'Winter',
      statusOfVegy: 'Very Dense',
      descriptor: 'Tropical dry evergreen forest',
      radiusOfArea: '1000m',
      remark: 'Good visibility, minimal disturbance',
      imageUri: null,
      teamMembers: ['Mike Chen'],
      birdObservations: [
        {
          id: 4,
          uniqueId: 'survey_002',
          species: 'Indian Paradise Flycatcher (Terpsiphone paradisi)',
          count: '2',
          maturity: 'Adult',
          sex: 'Male',
          behaviour: 'Singing',
          identification: 'Confirmed',
          status: 'Resident',
          remarks: 'Beautiful black and white plumage',
          imageUri: null,
        },
        {
          id: 5,
          uniqueId: 'survey_002',
          species: 'Asian Fairy-bluebird (Irena puella)',
          count: '4',
          maturity: 'Adult',
          sex: 'Mixed',
          behaviour: 'Feeding',
          identification: 'Clear',
          status: 'Resident',
          remarks: 'Feeding on fruits in canopy',
          imageUri: null,
        },
      ],
      syncStatus: 'local',
    },
    {
      id: 3,
      uniqueId: 'survey_003',
      habitatType: 'Grassland',
      point: 'Point C',
      pointTag: 'Open Plateau',
      latitude: '7.2906',
      longitude: '80.6350',
      date: '2024-02-08',
      observers: 'Emma Wilson, David Brown',
      startTime: '05:30 AM',
      endTime: '08:45 AM',
      weather: 'Clear',
      water: 'Dry',
      season: 'Winter',
      statusOfVegy: 'Sparse',
      descriptor: 'High elevation grassland plateau',
      radiusOfArea: '1500m',
      remark: 'Early morning survey with excellent visibility',
      imageUri: null,
      teamMembers: ['Emma Wilson', 'David Brown'],
      birdObservations: [
        {
          id: 6,
          uniqueId: 'survey_003',
          species: 'Steppe Eagle (Aquila nipalensis)',
          count: '1',
          maturity: 'Adult',
          sex: 'Unknown',
          behaviour: 'Soaring',
          identification: 'Confirmed',
          status: 'Winter Visitor',
          remarks: 'Magnificent raptor in thermal soaring',
          imageUri: null,
        },
        {
          id: 7,
          uniqueId: 'survey_003',
          species: 'Indian Lark (Melanocorypha thesiger)',
          count: '12',
          maturity: 'Mixed',
          sex: 'Mixed',
          behaviour: 'Ground Foraging',
          identification: 'Probable',
          status: 'Resident',
          remarks: 'Flock in grassland habitat',
          imageUri: null,
        },
      ],
      syncStatus: 'cloud',
    },
  ];
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
        setEntries(merged.length > 0 ? merged : getDummyCollectionData());
        console.log('Total entries:', merged.length, '(cloud:', cloudEntries.length, ', local-only:', localOnly.length, ')');
      } catch (error) {
        console.error('Error fetching data:', error);
        // Show dummy data on error
        setEntries(getDummyCollectionData());
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
          <>
            {/* Check if showing dummy data */}
            {entries[0]?.uniqueId === 'survey_001' && (
              <View style={styles.demoDataBanner}>
                <Icon name="lightbulb" size={16} color="#FF6F00" />
                <Text style={styles.demoDataText}>Showing demo data</Text>
              </View>
            )}
            {entries.map((entry, index) => (
              <CollectionCard key={index} entry={entry} />
            ))}
          </>
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
  demoDataBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 6,
    gap: 8,
  },
  demoDataText: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: '600',
  },
});

export default CollectionPage;
