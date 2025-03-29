import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Share, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import WebFriendlyMap from '../components/WebFriendlyMap';

const IncidentDetailsScreen = ({ incident }) => {
  const handleNavigate = () => {
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

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this ${incident.type} incident at ${incident.latitude},${incident.longitude}: ${incident.description}`,
        url: `https://maps.google.com/?q=${incident.latitude},${incident.longitude}`
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share incident details');
    }
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Report Issue',
      'What would you like to report about this incident?',
      [
        {
          text: 'Incorrect Information',
          onPress: () => console.log('Incorrect Information reported')
        },
        {
          text: 'Not Real',
          onPress: () => console.log('Not Real reported')
        },
        {
          text: 'Duplicate',
          onPress: () => console.log('Duplicate reported')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[
            styles.typeBadge, 
            { backgroundColor: incident.verified ? '#4CAF50' : '#FF9800' }
          ]}>
            <Text style={styles.typeBadgeText}>
              {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
            </Text>
            <View style={styles.verificationDot}>
              <Text style={styles.verificationText}>
                {incident.verified ? 'Verified' : 'Unverified'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.timestamp}>
            {formatDate(incident.timestamp)}
          </Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          {incident.description}
        </Text>
        
        <WebFriendlyMap
          incidents={[incident]}
          initialRegion={{
            latitude: incident.latitude,
            longitude: incident.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          style={styles.mapContainer}
          onNavigate={handleNavigate}
        />
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={24} color="#333" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleReportIssue}
          >
            <Ionicons name="flag" size={24} color="#333" />
            <Text style={styles.actionButtonText}>Report Issue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF5722',
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  verificationDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  verificationText: {
    color: 'white',
    fontSize: 12,
  },
  timestamp: {
    color: 'white',
    fontSize: 14,
  },
  contentContainer: {
    padding: 20,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 26,
  },
  mapContainer: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonText: {
    marginTop: 5,
    color: '#333',
  }
});

export default IncidentDetailsScreen; 