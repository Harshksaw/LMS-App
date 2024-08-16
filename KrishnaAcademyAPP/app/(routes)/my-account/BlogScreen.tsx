import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BlogDetailScreen = () => {

  const route = useRoute();
  const { blogId } = route.params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`${SERVER_URI}/api/v1/DailyUpdate/getDailyUpdate/${blogId}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Failed to fetch blog details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!blog) {
    return <Text>Blog not found</Text>;
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      paddingTop: 40,
      backgroundColor: '#f5f5f5',
    }}>
    <ScrollView style={styles.container}>
      <Image source={{ uri: blog.image }} style={styles.image} />
      <Text style={styles.title}>{blog.title}</Text>
      
      <Text style={styles.description}>{blog.description}</Text>
      <Text style={styles.content}>{blog.content}</Text>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'column',
    gap:10,

  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 20,


  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  description: {paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
  },
});

export default BlogDetailScreen;