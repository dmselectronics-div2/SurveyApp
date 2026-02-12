import React, {useState} from 'react';
import {Card, Text} from 'react-native-paper';
import {StyleSheet, View, Image, ActivityIndicator, TouchableOpacity, LayoutAnimation, Platform, UIManager} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const parseSpeciesName = (speciesStr: string) => {
  const match = speciesStr.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (match) return {common: match[1].trim(), scientific: match[2].trim()};
  return {common: speciesStr, scientific: ''};
};

const CollectionCard = ({entry}: {entry: any}) => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);

  if (!entry) {
    return <ActivityIndicator size="large" color="#2e7d32" />;
  }

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleAddBird = () => {
    navigation.navigate('New', {selectedItemData: entry, addBird: true});
  };

  const birdCount = entry.birdObservations?.length || 0;

  return (
    <Card style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        {entry.imageUri ? (
          <Image source={{uri: entry.imageUri}} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Icon name="bird" size={40} color="#2e7d32" />
          </View>
        )}
        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <Text style={styles.habitatTitle}>{entry.habitatType || 'Survey'}</Text>
            {entry.syncStatus === 'cloud' ? (
              <View style={styles.syncBadgeCloud}>
                <Icon name="cloud-check" size={14} color="#fff" />
                <Text style={styles.syncBadgeText}>Synced</Text>
              </View>
            ) : entry.syncStatus === 'local' ? (
              <View style={styles.syncBadgeLocal}>
                <Icon name="cellphone" size={14} color="#fff" />
                <Text style={styles.syncBadgeText}>Local</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.dateText}>{entry.date || ''}</Text>
          {entry.pointTag ? (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{entry.pointTag}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Bird Observations Dropdown */}
      {birdCount > 0 && (
        <View>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={toggleExpand}
            activeOpacity={0.7}>
            <Icon name="bird" size={18} color="#2e7d32" />
            <Text style={styles.sectionTitle}>
              Bird Detail Records ({birdCount})
            </Text>
            <Icon
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={22}
              color="#2e7d32"
            />
          </TouchableOpacity>

          {expanded && (
            <View style={styles.birdsSection}>
              {entry.birdObservations.map((bird: any, idx: number) => {
                const parsed = parseSpeciesName(bird.species || '');
                return (
                  <View key={idx} style={styles.birdCard}>
                    <View style={styles.birdHeader}>
                      <Icon name="bird" size={16} color="#2e7d32" />
                      <Text style={styles.birdName}>
                        {parsed.common}
                        {parsed.scientific ? (
                          <Text style={styles.scientificName}> ({parsed.scientific})</Text>
                        ) : null}
                      </Text>
                      {bird.count ? (
                        <View style={styles.countBadge}>
                          <Text style={styles.countText}>x{bird.count}</Text>
                        </View>
                      ) : null}
                    </View>
                    <View style={styles.birdDetails}>
                      {bird.maturity ? <Text style={styles.birdTag}>{bird.maturity}</Text> : null}
                      {bird.sex ? <Text style={styles.birdTag}>{bird.sex}</Text> : null}
                      {bird.status ? <Text style={styles.birdTag}>{bird.status}</Text> : null}
                      {bird.identification ? <Text style={styles.birdTag}>{bird.identification}</Text> : null}
                    </View>
                    {bird.behaviour ? (
                      <Text style={styles.behaviourText}>Behaviour: {bird.behaviour}</Text>
                    ) : null}
                    {bird.remarks ? (
                      <Text style={styles.remarksText}>Remarks: {bird.remarks}</Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* Add Bird Record Button */}
      <TouchableOpacity style={styles.addBirdBtn} onPress={handleAddBird} activeOpacity={0.7}>
        <Icon name="plus-circle" size={20} color="#fff" />
        <Text style={styles.addBirdText}>Add Bird Record</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
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
  syncBadgeCloud: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  syncBadgeLocal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F57C00',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  syncBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  habitatTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'InriaSerif-Bold',
    color: '#1b5e20',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
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
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  birdsSection: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1b5e20',
    flex: 1,
    marginLeft: 8,
  },
  birdCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2e7d32',
  },
  birdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birdName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  scientificName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
  },
  birdDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  birdTag: {
    fontSize: 11,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  behaviourText: {
    fontSize: 12,
    color: '#555',
    marginTop: 6,
    fontStyle: 'italic',
  },
  remarksText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  addBirdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e7d32',
    margin: 12,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  addBirdText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CollectionCard;
