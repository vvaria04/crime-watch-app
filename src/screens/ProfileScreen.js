import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  // User state would normally come from context or redux
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    isVerified: true,
    joinDate: '2023-05-15',
    reportsSubmitted: 12,
    reportVerifications: 3
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    darkMode: false,
    locationSharing: true,
    dataUsage: 'high',
    notificationDistance: 5, // km
    anonymousReporting: false,
    autoVerification: true,
  });

  // Toggle switch settings
  const toggleSetting = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          onPress: () => {
            // Would normally clear auth state and navigate to login
            Alert.alert('Signed out successfully');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleEditProfile = () => {
    // Would navigate to edit profile screen
    Alert.alert('Edit Profile', 'This would open the edit profile screen');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitials}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          )}
        </View>
        
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.reportsSubmitted}</Text>
          <Text style={styles.statLabel}>Reports Submitted</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.reportVerifications}</Text>
          <Text style={styles.statLabel}>Verifications</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDate(user.joinDate)}</Text>
          <Text style={styles.statLabel}>Member Since</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingDescription}>Use dark theme</Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={() => toggleSetting('darkMode')}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={'#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Location Sharing</Text>
            <Text style={styles.settingDescription}>Share your location with the app</Text>
          </View>
          <Switch
            value={settings.locationSharing}
            onValueChange={() => toggleSetting('locationSharing')}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={'#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Anonymous Reporting</Text>
            <Text style={styles.settingDescription}>Hide your identity when reporting</Text>
          </View>
          <Switch
            value={settings.anonymousReporting}
            onValueChange={() => toggleSetting('anonymousReporting')}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={'#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Auto-Verification</Text>
            <Text style={styles.settingDescription}>Allow automatic verification by AI</Text>
          </View>
          <Switch
            value={settings.autoVerification}
            onValueChange={() => toggleSetting('autoVerification')}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={'#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.accountRow} onPress={() => Alert.alert('Change Password', 'This would open the change password screen')}>
          <Ionicons name="key-outline" size={24} color="#555" />
          <Text style={styles.accountText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountRow} onPress={() => Alert.alert('Privacy Settings', 'This would open the privacy settings screen')}>
          <Ionicons name="lock-closed-outline" size={24} color="#555" />
          <Text style={styles.accountText}>Privacy Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountRow} onPress={() => Alert.alert('Notification Settings', 'This would open the notification settings screen')}>
          <Ionicons name="notifications-outline" size={24} color="#555" />
          <Text style={styles.accountText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountRow} onPress={() => Alert.alert('Help & Support', 'This would open the help and support screen')}>
          <Ionicons name="help-circle-outline" size={24} color="#555" />
          <Text style={styles.accountText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.accountRow, styles.signOutRow]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF5722" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Community Crime Watch v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  sectionContainer: {
    backgroundColor: 'white',
    marginBottom: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  accountText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  signOutRow: {
    borderBottomWidth: 0,
  },
  signOutText: {
    flex: 1,
    fontSize: 16,
    color: '#FF5722',
    marginLeft: 12,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});

export default ProfileScreen; 