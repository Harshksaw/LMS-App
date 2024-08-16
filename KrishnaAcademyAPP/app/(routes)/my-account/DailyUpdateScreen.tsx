import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { Toast } from 'react-native-toast-notifications';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const DailyUpdatesScreen = () => {
  const [updates, setUpdates] = useState([]);
  const [loading,setLoading] = useState(false)

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
  const handleSolutions = (id) => {
    console.log("ID", id);
    router.push({
      pathname: '/(routes)/my-account/BlogScreen',
      params: {blogId : id}
    })
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}
    onPress={()=> handleSolutions(item._id)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description.slice(0,100)}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if(loading){
    return <ActivityIndicator color={'blue'} size={'large'} 
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    />
  }

  return (
    <SafeAreaView
    style={{
      flex: 1,
      paddingTop: 40,
      backgroundColor: '#f5f5f5',
    }}
    >
      <Text
      style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 10,
        textAlign: 'center',
      }}>
        Daily Updates
      </Text>

    <FlatList
      data={updates}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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