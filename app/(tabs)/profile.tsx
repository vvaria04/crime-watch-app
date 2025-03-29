import { StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import ProfileScreen from '@/src/screens/ProfileScreen';

export default function ProfileTabScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 