import Button from '@/components/button/button';
import useUser from '@/hooks/auth/useUser';
import { SERVER_URI } from '@/utils/uri';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Toast } from 'react-native-toast-notifications';

const ProfileScreen = () => {



  const { user, loading, setRefetch } = useUser();

  const [info, setUser] = useState({
    dob: '', // Initial value for demonstration
    state: '',
    city: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleUpdatePress = () => {
    // Handle update logic here
    setIsEditing(false);
  };





  const handleAdditionDetails = async () => {


    try {

      const response = await fetch(`${SERVER_URI}/api/v1/user/additionalDetails`, {


      })


    } catch (error) {
      Toast.show('Error in updating profile', { type: 'danger' })

    }

  }
  return (

    user ? (

      <View style={styles.container}>

        <View style={styles.userInfoWrapper}>
          <Image
            source={{
              uri: `https://api.dicebear.com/5.x/initials/svg?seed=${user?.name}`,
            }}
            width={120}
            height={120}

            style={{
              borderRadius: 40,
              // margin: 10,
            }}
          />
          <View style={styles.userDetailsWrapper}>
            <Text style={styles.userName}> {user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
        <Text style={styles.phoneNumber}>{user?.phoneNumber}</Text>

        <View

          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,

          }}>

          {isEditing ? (
            <>
              <TextInput
                style={styles.editableInput}
                value={info?.dob}
                onChangeText={(value) => handleInputChange('dob', value)}
              />
              <TextInput
                style={styles.editableInput}
                value={info?.state}
                onChangeText={(value) => handleInputChange('state', value)}
              />
              <TextInput
                style={styles.editableInput}
                value={info?.city}
                onChangeText={(value) => handleInputChange('city', value)}
              />
              <Button title="Update" onPress={handleUpdatePress} />
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleEditPress}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 10,
                  width: '80%',
                  borderWidth: 1,
                  borderColor: '#ccc',
                  marginTop: 10,
                }}>
                  <Text>{info?.dob || 'Edit DOB'}</Text>
                  {/* <FontAwesomeIcon icon={faPencilAlt} /> */}
                </View>
              </TouchableOpacity>
              {/* Similar components for state and city */}
            </>
          )}
        </View>
      </View>) : (
      <ActivityIndicator size="large" color="#000" />
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',

    padding: 20,
  },
  userInfoWrapper: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // borderBottomColor: "#000",
    // borderBottomWidth: 1,
    // marginBottom: 10,
  }, userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
    flexDirection: "column",
    gap: 20,

  },
  userName: {
    fontSize: 25,

    fontWeight: "bold",
    textAlign: "center",
  },
  userEmail: {
    fontSize: 20,

    fontStyle: "italic",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  email: {
    fontSize: 16,
    marginTop: 10,
  },
  phoneNumber: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginTop: 10,
  },
  editableInput: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
  },
});

export default ProfileScreen;
