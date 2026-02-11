import * as React from 'react';
import {Card, Text} from 'react-native-paper';
import {StyleSheet, View, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const parseSpeciesName = (speciesStr: string) => {
  const match = speciesStr.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (match) return {common: match[1].trim(), scientific: match[2].trim()};
  return {common: speciesStr, scientific: ''};
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  try {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  } catch {
    return timeStr;
  }
};

const DetailRow = ({icon, label, value}: {icon: string; label: string; value: string}) => {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Icon name={icon} size={16} color="#2e7d32" />
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
};

const CollectionCard = ({entry}: {entry: any}) => {
  const navigation = useNavigation();

  if (!entry) {
    return <ActivityIndicator size="large" color="#2e7d32" />;
  }

  const handleSurveyClick = () => {
    navigation.navigate('New', {selectedItemData: entry});
  };

  return (
    <TouchableOpacity onPress={handleSurveyClick} activeOpacity={0.8}>
      <Card style={styles.card}>
        {/* Header with image and title */}
        <View style={styles.header}>
          {entry.imageUri ? (
            <Image source={{uri: entry.imageUri}} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Icon name="bird" size={40} color="#2e7d32" />
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.habitatTitle}>{entry.habitatType || 'Survey'}</Text>
            <Text style={styles.dateText}>{entry.date || ''}</Text>
            {entry.pointTag ? (
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{entry.pointTag}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Survey Details */}
        <View style={styles.detailsSection}>
          <DetailRow icon="map-marker" label="Location" value={entry.latitude && entry.longitude ? `${entry.latitude}, ${entry.longitude}` : ''} />
          <DetailRow icon="account" label="Observer" value={entry.observers} />
          <DetailRow icon="clock-start" label="Start" value={formatTime(entry.startTime)} />
          <DetailRow icon="clock-end" label="End" value={formatTime(entry.endTime)} />
          <DetailRow icon="weather-cloudy" label="Weather" value={entry.weather} />
          <DetailRow icon="water" label="Water" value={entry.water} />
          <DetailRow icon="leaf" label="Vegetation" value={entry.statusOfVegy} />
          {entry.season ? <DetailRow icon="sprout" label="Season" value={entry.season} /> : null}
          {entry.radiusOfArea ? <DetailRow icon="radius" label="Radius" value={`${entry.radiusOfArea}m`} /> : null}
          {entry.descriptor ? <DetailRow icon="text" label="Descriptor" value={entry.descriptor} /> : null}
        </View>

        {/* Bird Observations */}
        {entry.birdObservations && entry.birdObservations.length > 0 && (
          <View style={styles.birdsSection}>
            <Text style={styles.sectionTitle}>
              Bird Observations ({entry.birdObservations.length})
            </Text>
            {entry.birdObservations.map((bird: any, idx: number) => {
              const parsed = parseSpeciesName(bird.species || '');
              return (
                <View key={idx} style={styles.birdCard}>
                  <View style={styles.birdHeader}>
                    <Icon name="bird" size={16} color="#2e7d32" />
                    <Text style={styles.birdName}>{parsed.common}</Text>
                    {bird.count ? (
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>x{bird.count}</Text>
                      </View>
                    ) : null}
                  </View>
                  {parsed.scientific ? (
                    <Text style={styles.scientificName}>{parsed.scientific}</Text>
                  ) : null}
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
      </Card>
    </TouchableOpacity>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
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
  detailsSection: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    marginLeft: 4,
    flex: 1,
  },
  birdsSection: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 8,
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
    marginLeft: 22,
    marginTop: 2,
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
});

export default CollectionCard;
