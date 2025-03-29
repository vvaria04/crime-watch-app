import { StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import AlertsScreen from '@/src/screens/AlertsScreen';

export default function AlertsTabScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <AlertsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 