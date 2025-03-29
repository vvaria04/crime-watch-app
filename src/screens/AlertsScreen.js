import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, RefreshControl, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AlertsScreen = () => {
  const navigation = useNavigation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [proximityAlerts, setProximityAlerts] = useState(true);
  const [proximity, setProximity] = useState(5); // km

  useEffect(() => {
    // Load alerts when the component mounts
    fetchAlerts();
  }, []);

  const fetchAlerts = () => {
    // In a real app, this would be an API call
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const mockAlerts = [
        {
          id: '1',
          type: 'proximity',
          title: 'New Incident Nearby',
          description: 'Theft reported 0.8 miles from your location',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          read: false,
          incident: {
            id: 101,
            type: 'theft',
            description: 'Bike stolen from front yard',
            latitude: 37.78825,
            longitude: -122.4324,
            timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
            verified: true
          }
        },
        {
          id: '2',
          type: 'official',
          title: 'Community Alert',
          description: 'Police increased patrols in north area due to recent incidents',
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
          read: true,
          source: 'Local Police Department'
        },
        {
          id: '3',
          type: 'update',
          title: 'Incident Update',
          description: 'Vandalism report you submitted has been verified',
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
          read: false,
          incident: {
            id: 92,
            type: 'vandalism',
            description: 'Graffiti on community center wall',
            latitude: 37.78525,
            longitude: -122.4352,
            timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
            verified: true
          }
        }
      ];
      
      setAlerts(mockAlerts);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const markAsRead = (id) => {
    // In a real app, this would make an API call
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleAlertPress = (alert) => {
    markAsRead(alert.id);
    
    if (alert.incident) {
      navigation.navigate('IncidentDetails', { incident: alert.incident });
    } else if (alert.type === 'official') {
      // Display alert details for official announcements
      Alert.alert(
        alert.title,
        alert.description,
        [{ text: 'OK' }]
      );
    }
  };

  const renderAlertItem = ({ item }) => {
    const alertTypeIcons = {
      proximity: 'location',
      official: 'shield-checkmark',
      update: 'refresh-circle'
    };

    return (
      <TouchableOpacity 
        style={[
          styles.alertItem, 
          !item.read && styles.unreadAlert
        ]}
        onPress={() => handleAlertPress(item)}
      >
        <View style={[
          styles.alertIcon, 
          {
            backgroundColor: 
              item.type === 'proximity' ? '#FF9800' : 
              item.type === 'official' ? '#4CAF50' : '#2196F3'
          }
        ]}>
          <Ionicons 
            name={alertTypeIcons[item.type]} 
            size={24} 
            color="white" 
          />
        </View>
        
        <View style={styles.alertContent}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          
          <Text style={styles.alertDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.alertFooter}>
            <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
            
            {item.type === 'official' && (
              <View style={styles.sourceTag}>
                <Text style={styles.sourceText}>{item.source}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // In a real app, this would update user preferences in storage or backend
  };

  const toggleProximityAlerts = () => {
    setProximityAlerts(!proximityAlerts);
    // In a real app, this would update user preferences in storage or backend
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts & Notifications</Text>
      </View>

      <View style={styles.settingsContainer}>
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>Receive app notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={'#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Proximity Alerts</Text>
            <Text style={styles.settingDescription}>
              Notify about incidents within {proximity} km
            </Text>
          </View>
          <Switch
            value={proximityAlerts}
            onValueChange={toggleProximityAlerts}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={'#f4f3f4'}
            disabled={!notificationsEnabled}
          />
        </View>
      </View>

      <View style={styles.alertsContainer}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        
        {loading && alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={40} color="#ccc" />
            <Text style={styles.emptyText}>Loading alerts...</Text>
          </View>
        ) : alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No alerts at this time</Text>
          </View>
        ) : (
          <FlatList
            data={alerts}
            renderItem={renderAlertItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.alertsList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#FF5722']}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  alertsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  alertsList: {
    padding: 8,
  },
  alertItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadAlert: {
    backgroundColor: '#f8f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4A90E2',
    marginLeft: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  sourceTag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sourceText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default AlertsScreen; 