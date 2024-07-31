import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { enableScreens, Screen } from 'react-native-screens';
import {router} from 'expo-router';

enableScreens();

const PDFViewerScreen = () => {
  const route = useRoute();
  const { pdfUri } = route.params;

  console.log(pdfUri);
  const googleDocsViewerUri = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUri)}`;

  useEffect(() => {
    // Prevent screenshots
    const preventScreenCapture = async () => {
      await Screen.preventScreenCapture(true);
    };
    preventScreenCapture();

    return () => {
      // Allow screenshots when leaving the screen
      const allowScreenCapture = async () => {
        await Screen.preventScreenCapture(false);
      };
      allowScreenCapture();
    };
  }, []);

  return (
    <Screen style={styles.screen}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <WebView
          source={{ uri: googleDocsViewerUri }}
          style={styles.webview}
          onShouldStartLoadWithRequest={(request) => {
            // Disable downloading by intercepting download requests
            if (request.url.endsWith('.pdf')) {
              return false;
            }
            return true;
          }}
        />
      </SafeAreaView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  webview: {
    flex: 1,
  },
});

export default PDFViewerScreen;