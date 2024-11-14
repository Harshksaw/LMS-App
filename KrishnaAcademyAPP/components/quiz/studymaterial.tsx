import { Image } from "expo-image";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { usePreventScreenCapture } from "expo-screen-capture";
import { router } from "expo-router";

const StudyMaterialCard = ({ studyMaterials }) => {
  console.log("🚀 ~ StudyMaterialCard ~ studyMaterials:", studyMaterials);
  usePreventScreenCapture();

  const handlePress = (item) => {
    router.push({
      pathname: "(routes)/pdfviewer",
      params: { pdfUri: item.fileUrl },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
      <View style={styles.cardContent}>
      <Image
              style={{
                width: "30%",
                height: "90%",
                borderRadius: 5,
                alignSelf: "center",
                objectFit: "cover",
              }}
              source={{
                uri: "https://poainc.org/wp-content/uploads/2018/06/pdf-placeholder.png"
              }}
            />
            <View
            style={{
              flexDirection:'column',
              justifyContent: "center",
              marginTop: 15,
              width: "50%",
              height: "100%",

            }}
            >

        <Text style={styles.title}>{item?.title?.slice(0, 10)}</Text>
        <Text style={styles.title}>{item?.description?.slice(0, 20)}</Text>
            </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={studyMaterials}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}

    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flex: 1,
    width: "95%",
    marginBottom: 16,
    flexDirection: "row",
    marginHorizontal: 10,
    paddingBottom :20,

    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: 120,
    maxWidth: "95%",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 20,

    backgroundColor: "rgb(235, 229, 229)",
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom : 10,

    gap: 15,
    height: 100,
  },
  image: {
    // width: "90%",
    // height: "90%",
    borderRadius: 5,
    alignSelf: "center",
    objectFit: "cover",
  },
  title: {
    fontSize: 14,
    textAlign: "left",
    fontWeight: "400",
  },
});

export default StudyMaterialCard;