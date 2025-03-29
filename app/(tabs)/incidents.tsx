import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, FlatList, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, RefreshControl, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

// Import Ionicons types
import { Ionicons as IonIconsTypes } from '@expo/vector-icons';
type IconName = React.ComponentProps<typeof IonIconsTypes>['name'];

// Define the Incident type
interface Incident {
  id: number;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  verified: boolean;
}

export default function IncidentsScreen() {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'theft', 'vandalism', 'assault', 'suspicious', 'other'

  useEffect(() => {
    // In a real app, this would fetch from an API
    fetchIncidents();
  }, []);

  const fetchIncidents = () => {
    // Mock data - would be replaced with API call
    setTimeout(() => {
      const mockIncidents: Incident[] = [
        {
          id: 1,
          type: 'theft',
          description: 'Bike stolen from front yard',
          latitude: 37.78825,
          longitude: -122.4324,
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
          verified: true
        },
        {
          id: 2,
          type: 'vandalism',
          description: 'Graffiti on public building',
          latitude: 37.78525,
          longitude: -122.4352,
          timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
          verified: false
        },
        {
          id: 3,
          type: 'assault',
          description: 'Verbal altercation escalated',
          latitude: 37.78925,
          longitude: -122.4372,
          timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
          verified: true
        },
        {
          id: 4,
          type: 'suspicious',
          description: 'Person checking car doors in parking lot',
          latitude: 37.78425,
          longitude: -122.4392,
          timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
          verified: true
        },
        {
          id: 5,
          type: 'theft',
          description: 'Package stolen from doorstep',
          latitude: 37.78725,
          longitude: -122.4342,
          timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
          verified: false
        }
      ];
      
      setIncidents(mockIncidents);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const handleIncidentPress = (incident: Incident) => {
    router.push({
      pathname: "/incident-details",
      params: { incident: JSON.stringify(incident) }
    });
  };

  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
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

  const getFilteredIncidents = (): Incident[] => {
    if (filter === 'all') return incidents;
    return incidents.filter(incident => incident.type === filter);
  };

  const renderIncidentItem = ({ item }: { item: Incident }) => {
    const incidentTypeIcons: Record<string, IconName> = {
      theft: 'basket',
      vandalism: 'color-palette',
      assault: 'flash',
      suspicious: 'eye',
      traffic: 'car',
      other: 'help-circle'
    };

    const incidentColors: Record<string, string> = {
      theft: '#FF9800',
      vandalism: '#9C27B0',
      assault: '#F44336',
      suspicious: '#2196F3',
      traffic: '#4CAF50',
      other: '#607D8B'
    };

    return (
      <TouchableOpacity 
        style={styles.incidentItem}
        onPress={() => handleIncidentPress(item)}
      >
        <View style={[
          styles.incidentIcon, 
          { backgroundColor: incidentColors[item.type] || '#999' }
        ]}>
          <Ionicons 
            name={incidentTypeIcons[item.type] || 'alert'} 
            size={24} 
            color="white" 
          />
        </View>
        
        <View style={styles.incidentContent}>
          <View style={styles.incidentHeader}>
            <Text style={styles.incidentType}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            <View style={[
              styles.verificationBadge, 
              { backgroundColor: item.verified ? '#4CAF50' : '#FFC107' }
            ]}>
              <Text style={styles.verificationText}>
                {item.verified ? 'Verified' : 'Unverified'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.incidentDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.incidentFooter}>
            <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filterType: string, label: string, icon: IconName) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.activeFilterButton
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Ionicons 
        name={icon} 
        size={16} 
        color={filter === filterType ? 'white' : '#555'} 
      />
      <Text style={[
        styles.filterButtonText,
        filter === filterType && styles.activeFilterText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchIncidents();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incident Reports</Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScrollView}>
          {renderFilterButton('all', 'All', 'grid')}
          {renderFilterButton('theft', 'Theft', 'basket')}
          {renderFilterButton('vandalism', 'Vandalism', 'color-palette')}
          {renderFilterButton('assault', 'Assault', 'flash')}
          {renderFilterButton('suspicious', 'Suspicious', 'eye')}
          {renderFilterButton('other', 'Other', 'help-circle')}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5722" />
          <Text style={styles.loadingText}>Loading incidents...</Text>
        </View>
      ) : getFilteredIncidents().length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            {filter === 'all' 
              ? 'No incidents reported yet.'
              : `No ${filter} incidents reported yet.`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredIncidents()}
          renderItem={renderIncidentItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.incidentsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF5722']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

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
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  filtersScrollView: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  activeFilterButton: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
  incidentsList: {
    padding: 16,
  },
  incidentItem: {
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
  incidentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incidentContent: {
    flex: 1,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  verificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  incidentDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  incidentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
}); 