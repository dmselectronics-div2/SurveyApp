import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  color,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: theme.colors.surface}]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={[styles.iconContainer, {backgroundColor: color + '20'}]}>
        <Icon name={icon} size={48} color={color} />
      </View>
      <Text style={[styles.cardTitle, {color: theme.colors.onSurface}]}>
        {title}
      </Text>
      <Text style={[styles.cardDescription, {color: theme.colors.onSurfaceVariant}]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const ModuleSelector: React.FC = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();

  const modules = [
    {
      id: 'bird',
      title: 'Bird Survey',
      description: 'Bird observation and monitoring',
      icon: 'bird',
      color: '#4CAF50',
      screen: 'BirdBottomNav',
    },
    {
      id: 'byvalvi',
      title: 'Byvalvi Survey',
      description: 'Bivalve & gastropod data collection',
      icon: 'waves',
      color: '#FF9800',
      screen: 'MangroveNew',
    },
    {
      id: 'citizen',
      title: 'Citizen Survey',
      description: 'Plants, animals, nature & human activity',
      icon: 'leaf',
      color: '#2196F3',
      screen: 'WelcomeSinhala',
    },
  ];

  const handleModuleSelect = (screenName: string) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.appName, {color: theme.colors.primary}]}>
          Blu Tally
        </Text>
        <Text style={[styles.title, {color: theme.colors.onSurface}]}>
          Select Survey Module
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
          Choose the survey you want to work with
        </Text>
      </View>

      {/* Module Cards */}
      <View style={styles.cardsContainer}>
        {modules.map(module => (
          <ModuleCard
            key={module.id}
            title={module.title}
            description={module.description}
            icon={module.icon}
            color={module.color}
            onPress={() => handleModuleSelect(module.screen)}
          />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileMenu')}>
          <Icon name="account-circle" size={24} color={theme.colors.primary} />
          <Text style={[styles.profileText, {color: theme.colors.primary}]}>
            My Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 20,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profileText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default ModuleSelector;
