import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import DailyUpdatesScreen from './DailyUpdateScreen';

export default function dailyIpdates() {
  return (
<SafeAreaView style={styles.container}>
      <DailyUpdatesScreen />
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
