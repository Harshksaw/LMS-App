
import useUser from '@/hooks/auth/useUser';
import { SERVER_URI } from '@/utils/uri';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'react-native-toast-notifications';

const ProfileScreen = () => {



  const { user, loading, setRefetch } = useUser();

  const [info, setInfo] = useState({
    dob: Date.now(),
    phoneNumber: '',
    state: '',
    email: '',
    city: '',
  });
  const handleAdditionDetails = async () => {


    try {

      const response = await fetch(`${SERVER_URI}/api/v1/user/additionalDetails`, {
        dob : info.dob, state : info.state, city: info.city

      })

      if(response.status ===200){
        Toast.show("Profile Updated")
      }


    } catch (error) {
      Toast.show('Error in updating profile', { type: 'danger' })

    }

  }


  const getUserDetails = async () => {
    const userI = await AsyncStorage.getItem("user");
    const isUser = JSON.parse(userI);
    setInfo({ ...info, phoneNumber: user.phoneNumber, email: user.email });
  }

  useEffect(() => {

    getUserDetails();

  }, [])




  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setInfo({ ...info, [field]: value });
  };

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleUpdatePress = () => {
    // Handle update logic here
    setIsEditing(false);
  };



  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };




  return (

    user ? (

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back-outline' size={30} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity onPress={handleEditToggle} style={{
            backgroundColor:'red',
            paddingHorizontal:20,
            padding:10,
            borderRadius:20
          }}>
            <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoWrapper}>
          <Image
            source={{
              uri: `https://api.dicebear.com/5.x/initials/svg?seed=${info?.name}`,
            }}
            width={120}
            height={120}
            style={styles.profilePic}
          />
          <View style={styles.userDetailsWrapper}>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
        </View>

        <TextInput
        style={styles.input}
        value={info.phoneNumber}
        // onChangeText={(value) => handleInputChange('phoneNumber', value)}
        placeholder="Phone Number"
        editable={isEditing}
      />
      <TextInput
        style={styles.input}
        value={info.email}
        // onChangeText={(value) => handleInputChange('email', value)}
        placeholder="Email"
        editable={isEditing}
      />
      <TextInput
        style={styles.input}
        value={info.dob}
        onChangeText={(value) => handleInputChange('dob', value)}
        placeholder="Date of Birth"
        editable={isEditing}
      />
      <TextInput
        style={styles.input}
        value={info.state}
        onChangeText={(value) => handleInputChange('state', value)}
        placeholder="State"
        editable={isEditing}
      />
        <TextInput
        style={styles.input}
        value={info.city}
        onChangeText={(value) => handleInputChange('city', value)}
        placeholder="City"
        editable={isEditing}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={{
          alignSelf:'center',
          backgroundColor:'red',
          borderRadius:20,
          padding:10,

        }}  onPress={handleAdditionDetails} ><Text style={{
          color:'#fff',
          fontSize:16,
          fontWeight:600
        }}>
            Change Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          alignSelf:'center',
          backgroundColor:'red',
          borderRadius:20,
          padding:10,

        }}  onPress={() => { /* Handle change password */ }} ><Text style={{
          color:'#fff',
          fontSize:16,
          fontWeight:600
        }}>
            Logout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          alignSelf:'center',
          backgroundColor:'red',
          borderRadius:20,
          padding:10,

        }}  onPress={handleAdditionDetails} ><Text style={{
          color:'#fff',
          fontSize:16,
          fontWeight:600
        }}>
        Submit
          </Text>
        </TouchableOpacity>
     
      </View>


      </SafeAreaView>) : (
      <ActivityIndicator size="large" color="#000" />
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal:20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal:20,
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: 'blue',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 16,

    color: 'white',

  },
  userInfoWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    borderRadius: 60,
    width: 120,
    height: 120,
  },
  userDetailsWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color:'#000'
  },
  buttonContainer: {
    flexDirection:'row',
    gap:10,
    
    marginTop: 20,
  },
});

export default ProfileScreen;