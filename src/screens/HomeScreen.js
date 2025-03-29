import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import WebFriendlyMap from '../components/WebFriendlyMap';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        // Web fallback
        setMapRegion({
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }

      // Fetch mock incidents (would be replaced with actual API call)
      fetchIncidents();
    })();
  }, []);

  const fetchIncidents = () => {
    // Mock data - would be replaced with API call
    const mockIncidents = [
      {
        id: 1,
        type: 'theft',
        description: 'Bike stolen from front yard',
        latitude: 37.78825,
        longitude: -122.4324,
        timestamp: new Date().toISOString(),
        verified: true
      },
      {
        id: 2,
        type: 'vandalism',
        description: 'Graffiti on public building',
        latitude: 37.78525,
        longitude: -122.4352,
        timestamp: new Date().toISOString(),
        verified: false
      },
      {
        id: 3,
        type: 'assault',
        description: 'Verbal altercation escalated',
        latitude: 37.78925,
        longitude: -122.4372,
        timestamp: new Date().toISOString(),
        verified: true
      }
    ];
    setIncidents(mockIncidents);
  };

  const handleMarkerPress = (incident) => {
    // Using expo-router for navigation with serialized incident data
    router.push({
      pathname: "/incident-details",
      params: { incident: JSON.stringify(incident) }
    });
  };

  const handleReportPress = () => {
    router.push("/report");
  };

  const handleNavigate = (incident) => {
    if (Platform.OS === 'web') {
      // For web, open Google Maps in a new tab
      const url = `https://www.google.com/maps/search/?api=1&query=${incident.latitude},${incident.longitude}`;
      window.open(url, '_blank');
    } else {
      // For native, use the Linking API
      const url = Platform.select({
        ios: `maps:0,0?q=${incident.latitude},${incident.longitude}`,
        android: `geo:0,0?q=${incident.latitude},${incident.longitude}`
      });
      
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open maps on this device');
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <WebFriendlyMap
        incidents={incidents}
        onMarkerPress={handleMarkerPress}
        initialRegion={mapRegion}
        showsUserLocation={true}
        style={styles.map}
        onNavigate={handleNavigate}
      />
      <TouchableOpacity
        style={styles.reportButton}
        onPress={handleReportPress}
      >
        <Ionicons name="add-circle" size={60} color="#FF5722" />
      </TouchableOpacity>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'green' }]} />
          <Text style={styles.legendText}>Verified</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'red' }]} />
          <Text style={styles.legendText}>Unverified</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  reportButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  }
});

export default HomeScreen; 