import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {API_URL} from '../../config';
import {getDatabase} from '../database/db';

const GREEN = '#2e7d32';

const TeamMembersPage = () => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
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

  const fetchTeamMembers = async () => {
    if (!email) return;
    try {
      const response = await axios.get(`${API_URL}/getTeamMembers`, {params: {email}});
      if (response.data.teamMembers) setTeamMembers(response.data.teamMembers);
    } catch (error) {
      console.log('Could not fetch team members from server');
    }
  };

  const saveToServer = async (updatedMembers: string[]) => {
    try {
      await axios.post(`${API_URL}/saveOrUpdateTeamData`, {
        teamMembers: updatedMembers,
        email,
      });
    } catch (error) {
      console.log('Team save (will sync later):', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      retrieveEmail();
    }, []),
  );

  // Fetch team members when email is ready
  React.useEffect(() => {
    if (email) fetchTeamMembers();
  }, [email]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeamMembers();
    setRefreshing(false);
  };

  const addMember = () => {
    const name = memberInput.trim();
    if (!name) {
      Alert.alert('Error', 'Please enter a valid name.');
      return;
    }
    if (teamMembers.includes(name)) {
      Alert.alert('Duplicate', 'This team member already exists.');
      return;
    }
    const updated = [...teamMembers, name];
    setTeamMembers(updated);
    setMemberInput('');
    saveToServer(updated);
  };

  const saveEdit = () => {
    if (editIndex === null) return;
    const name = memberInput.trim();
    if (!name) {
      Alert.alert('Error', 'Please enter a valid name.');
      return;
    }
    const updated = [...teamMembers];
    updated[editIndex] = name;
    setTeamMembers(updated);
    setMemberInput('');
    setEditIndex(null);
    saveToServer(updated);
  };

  const deleteMember = (index: number) => {
    Alert.alert('Delete Member', `Remove "${teamMembers[index]}" from the team?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (editIndex === index) {
            setEditIndex(null);
            setMemberInput('');
          }
          const updated = teamMembers.filter((_, i) => i !== index);
          setTeamMembers(updated);
          saveToServer(updated);
        },
      },
    ]);
  };

  const startEdit = (index: number) => {
    setMemberInput(teamMembers[index]);
    setEditIndex(index);
  };

  const cancelEdit = () => {
    setMemberInput('');
    setEditIndex(null);
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

      {/* Add / Edit Input */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {editIndex !== null ? 'Edit Team Member' : 'Add Team Member'}
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            mode="outlined"
            placeholder="Enter member name"
            value={memberInput}
            onChangeText={setMemberInput}
            style={styles.input}
            outlineColor={GREEN}
            activeOutlineColor={GREEN}
            placeholderTextColor="#999"
            textColor="#333"
          />
          {memberInput.length > 0 && (
            <TouchableOpacity onPress={cancelEdit} style={styles.clearBtn}>
              <Icon name="times-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={editIndex !== null ? saveEdit : addMember}
            style={styles.addBtn}>
            <Icon name={editIndex !== null ? 'check' : 'plus'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {editIndex !== null && (
          <Text style={styles.editingHint}>
            Editing: {teamMembers[editIndex]}
          </Text>
        )}
      </View>

      {/* Team Members List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Team Members ({teamMembers.length})
        </Text>
        {teamMembers.length > 0 ? (
          teamMembers.map((member, index) => (
            <View
              key={index}
              style={[
                styles.memberItem,
                editIndex === index && styles.memberItemEditing,
              ]}>
              <View style={styles.memberInfo}>
                <View style={styles.memberAvatar}>
                  <Icon name="user" size={16} color={GREEN} />
                </View>
                <Text style={styles.memberName}>{member}</Text>
              </View>
              <View style={styles.memberActions}>
                <TouchableOpacity onPress={() => startEdit(index)} style={styles.actionBtn}>
                  <Icon name="edit" size={18} color={GREEN} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMember(index)} style={styles.actionBtn}>
                  <Icon name="trash" size={18} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="users" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No team members yet</Text>
            <Text style={styles.emptySubtext}>Add members above to get started</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 12,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  clearBtn: {
    position: 'absolute',
    right: 70,
    padding: 5,
    zIndex: 1,
  },
  addBtn: {
    backgroundColor: GREEN,
    padding: 12,
    borderRadius: 8,
  },
  editingHint: {
    fontSize: 12,
    color: GREEN,
    fontStyle: 'italic',
    marginTop: 6,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  memberItemEditing: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 3,
    borderLeftColor: GREEN,
    borderRadius: 6,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  memberActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginLeft: 12,
    padding: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#1b5e20',
    fontWeight: '600',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#4caf50',
    marginTop: 4,
  },
});

export default TeamMembersPage;
