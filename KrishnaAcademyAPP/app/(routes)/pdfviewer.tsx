import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';
import { useRoute } from "@react-navigation/native";
import Pdf from 'react-native-pdf';

const PDFViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pdfUri } = route.params;
  const [error, setError] = useState(null);
  useEffect(() => {
    const openPDF = async () => {
      try {
        const supported = await Linking.canOpenURL(pdfUri);
        if (supported) {
          await Linking.openURL(pdfUri);
        } else {
          Alert.alert(`Don't know how to open this URL: ${pdfUri}`);
        }
      } catch (error) {
        Alert.alert('Failed to open PDF', error.message);
      }
    };

    openPDF();
  }, [pdfUri]);

  console.log("🚀 ~ PDFViewerScreen ~ pdfUri:", pdfUri)

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Opening PDF in browser...</Text>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: 'blue',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
  },
});

export default PDFViewerScreen;