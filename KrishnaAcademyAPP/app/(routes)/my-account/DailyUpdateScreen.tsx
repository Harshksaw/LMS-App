import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { Toast } from 'react-native-toast-notifications';

const DailyUpdatesScreen = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/api/v1/DailyUpdate/getAllUpdates`);
        setUpdates(response.data);
      } catch (error) {
        console.error(error);
        Toast.show('Failed to fetch updates', {
            type: 'danger',
        });
      }
    };

    fetchUpdates();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={updates}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default DailyUpdatesScreen;