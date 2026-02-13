import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {API_URL} from '../../config';
import {getDatabase} from '../database/db';

const GREEN = '#2e7d32';

const AllTeamMembersPage = () => {
  const navigation = useNavigation();
  const [birdMembers, setBirdMembers] = useState<string[]>([]);
  const [byvalviMembers, setByvalviMembers] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const retrieveEmail = async () => {
    try {
      const db = await getDatabase();
      db.transaction((tx: any) => {
        tx.executeSql('SELECT email FROM LoginData LIMIT 1', [], (_: any, results: any) => {
          if (results.rows.length > 0) setEmail(results.rows.item(0).email);
        });
      });
    } catch (error) {
      console.error('Error retrieving email:', error);
    }
  };

  const fetchAllMembers = async () => {
    if (!email) return;
    try {
      const [birdRes, byvalviRes] = await Promise.all([
        axios.get(`${API_URL}/getTeamMembers`, {params: {email, moduleType: 'bird'}}),
        axios.get(`${API_URL}/getTeamMembers`, {params: {email, moduleType: 'byvalvi'}}),
      ]);
      if (birdRes.data.teamMembers) setBirdMembers(birdRes.data.teamMembers);
      if (byvalviRes.data.teamMembers) setByvalviMembers(byvalviRes.data.teamMembers);
    } catch (error) {
      console.log('Could not fetch team members from server');
    }
  };

  useFocusEffect(
    useCallback(() => {
      retrieveEmail();
    }, []),
  );

  React.useEffect(() => {
    if (email) fetchAllMembers();
  }, [email]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllMembers();
    setRefreshing(false);
  };

  const renderMemberList = (members: string[]) => {
    if (members.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="users" size={30} color="#ccc" />
          <Text style={styles.emptyText}>No team members yet</Text>
        </View>
      );
    }
    return members.map((member, index) => (
      <View key={index} style={styles.memberItem}>
        <View style={styles.memberAvatar}>
          <Icon name="user" size={14} color={GREEN} />
        </View>
        <Text style={styles.memberName}>{member}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Team Members</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

        {/* Bird Team Members */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, {backgroundColor: '#e8f5e9'}]}>
              <Icon name="twitter" size={16} color={GREEN} />
            </View>
            <Text style={styles.cardTitle}>Bird Team Members ({birdMembers.length})</Text>
          </View>
          {renderMemberList(birdMembers)}
        </View>

        {/* Byvalvi Team Members */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, {backgroundColor: '#e3f2fd'}]}>
              <Icon name="leaf" size={16} color="#1565c0" />
            </View>
            <Text style={styles.cardTitle}>Byvalvi Team Members ({byvalviMembers.length})</Text>
          </View>
          {renderMemberList(byvalviMembers)}
        </View>

        <View style={styles.infoCard}>
          <Icon name="info-circle" size={14} color="#888" />
          <Text style={styles.infoText}>
            To add or edit team members, go to the Team tab inside each module.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  container: {
    padding: 14,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberName: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 8,
    flex: 1,
  },
});

export default AllTeamMembersPage;
