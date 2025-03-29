import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Only import native modules if not on web
let MapView, Marker, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  const ReactNativeMaps = require('react-native-maps');
  MapView = ReactNativeMaps.default;
  Marker = ReactNativeMaps.Marker;
  PROVIDER_GOOGLE = ReactNativeMaps.PROVIDER_GOOGLE;
}

/**
 * A cross-platform map component that works on both web and native platforms
 */
const WebFriendlyMap = ({ 
  incidents = [], 
  onMarkerPress, 
  initialRegion,
  showsUserLocation = false,
  scrollEnabled = true,
  style = {},
  onNavigate = null
}) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webContainer, style]}>
        <Text style={styles.webMapText}>Map View</Text>
        <Text style={styles.webMapSubtext}>
          {incidents.length} incident{incidents.length !== 1 ? 's' : ''} in this area
        </Text>
        <View style={styles.incidentsList}>
          {incidents.map((incident) => (
            <TouchableOpacity
              key={incident.id}
              style={styles.incidentItem}
              onPress={() => onMarkerPress && onMarkerPress(incident)}
            >
              <View style={styles.incidentHeader}>
                <View style={[
                  styles.incidentType,
                  { backgroundColor: incident.verified ? '#4CAF50' : '#FF9800' }
                ]}>
                  <Text style={styles.incidentTypeText}>
                    {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
                  </Text>
                </View>
                <Text style={styles.incidentTime}>
                  {new Date(incident.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.incidentDescription}>{incident.description}</Text>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => onNavigate && onNavigate(incident)}
              >
                <Ionicons name="navigate" size={18} color="white" />
                <Text style={styles.navigateText}>View on Google Maps</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  if (!MapView) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={showsUserLocation}
      >
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={{
              latitude: incident.latitude,
              longitude: incident.longitude
            }}
            onPress={() => onMarkerPress && onMarkerPress(incident)}
            title={incident.type}
            description={incident.description}
            pinColor={incident.verified ? 'green' : 'red'}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webContainer: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
  },
  webMapText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  webMapSubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  incidentsList: {
    gap: 15,
  },
  incidentItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  incidentType: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  incidentTypeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  incidentTime: {
    color: '#666',
    fontSize: 14,
  },
  incidentDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  navigateButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
  },
  navigateText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  }
});

export default WebFriendlyMap; 