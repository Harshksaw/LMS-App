import { View, Text } from 'react-native'
import React from 'react'
import StudyMaterialScreen from '@/components/Studymaterials/StudyScreen'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function index() {
  return (
    <SafeAreaView style={{
      flex:1,
    }}>
     <StudyMaterialScreen/>
    </SafeAreaView>
  )
}