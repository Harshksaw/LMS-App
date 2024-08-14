import { Image } from 'expo-image';
import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, FlatList } from 'react-native';

const StudyMaterialCard = ({ studyMaterials }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Study Materials</Text>
   
     
    

      <FlatList
        data={studyMaterials}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
                flex: 1,
                marginBottom: 16,
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",

                height: 150,
                maxWidth: "50%",
                gap: 10,
                padding: 10,
                margin: 10,
            
                backgroundColor: "#f0e5e5",
                borderRadius: 8,
              }}
            // onPress={()=>{console.log(item.fileUrl, "item.description")}}

            // onPress={() => router.push({
            //   pathname: '(routes)/pdfviewer',
            //   params: { pdfUri: item.fileUrl },
            // })}

            onPress={() => {
            //   console.log(item.fileUrl, "item-----");
            //   setPdfUri(item.fileUrl);
            //   handleOpenMaterial();
            }}
          >
            
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                height: 100,
              }}
            >
              <Image
                style={{
                  width: "70%",
                  height: "90%",
                  borderRadius: 5,
                  alignSelf: "center",
                  objectFit: "cover",
                }}
                source={{
                    uri: "https://poainc.org/wp-content/uploads/2018/06/pdf-placeholder.png",
                  }}
              />

              <Text style={ {
        fontSize: 14,
        textAlign:'left',
        fontWeight: "400",

      }}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>

  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
      },
      centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
  card: {
    // backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    // elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
});

export default StudyMaterialCard;