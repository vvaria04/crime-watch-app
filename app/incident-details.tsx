import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import IncidentDetailsScreen from '@/src/screens/IncidentDetailsScreen';

// Define incident type
interface Incident {
  id: number;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  verified: boolean;
}

export default function IncidentDetailsModal() {
  const params = useLocalSearchParams();
  const [incident, setIncident] = useState<Incident | null>(null);

  useEffect(() => {
    // Create a mock incident if none is provided
    if (!params.incident) {
      const mockIncident: Incident = {
        id: 1,
        type: 'theft',
        description: 'Mock incident for demonstration',
        latitude: 37.78825,
        longitude: -122.4324,
        timestamp: new Date().toISOString(),
        verified: true
      };
      setIncident(mockIncident);
    } else {
      // Parse the incident from params if it's a string
      try {
        if (typeof params.incident === 'string') {
          setIncident(JSON.parse(params.incident) as Incident);
        } else {
          setIncident(params.incident as unknown as Incident);
        }
      } catch (error) {
        console.error("Error parsing incident data:", error);
        // Fallback to default incident
        setIncident({
          id: 0,
          type: 'unknown',
          description: 'No details available',
          latitude: 37.78825,
          longitude: -122.4324,
          timestamp: new Date().toISOString(),
          verified: false
        });
      }
    }
  }, [params]);

  if (!incident) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <IncidentDetailsScreen incident={incident} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  }
}); 