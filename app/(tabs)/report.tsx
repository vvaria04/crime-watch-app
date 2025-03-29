import { StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import ReportIncidentScreen from '@/src/screens/ReportIncidentScreen';

export default function ReportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ReportIncidentScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 