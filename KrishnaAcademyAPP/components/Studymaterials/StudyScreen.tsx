import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";


import { router, useNavigation } from "expo-router";
// import PDFViewerModal from "../app/(routes)/pdfviewer";
import { Image } from "expo-image";

// import PaymentComponent from "./Payment/PaymentComponent";

interface StudyMaterial {
  _id: string;
  title: string;
  description: string;
  // Add other fields as necessary
}

const StudyMaterialsScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPdfUri, setSelectedPdfUri] = useState("");
  // const [paymentStatus, setPaymentStatus] = useState<boolean | null>(false);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [pdfUri, setPdfUri] = useState("");

  const openPdfModal = () => {
    setSelectedPdfUri(pdfUri);
    console.log("openPdfModal");
    console.log(pdfUri, "pdfUri");
    if (!pdfUri) {
      return;
    }
    router.push({
      pathname: "(routes)/pdfviewer",
      params: { pdfUri: pdfUri },
    });
  };

  const closePdfModal = () => {
    setModalVisible(false);
    setSelectedPdfUri("");
  };

  const fetchStudyMaterials = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URI}/api/v1/study/getAllStudyMaterials`
      );
      console.log(response.data, "---");
      setStudyMaterials(response.data.data.slice(0, 5)); // Limit to 5 items
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      setError("Failed to fetch study materials");
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudyMaterials();
  }, [refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudyMaterials();
  };

  const handleOpenMaterial = async () => {
    // console.log("open========", item) ;
    setModalVisible(true);
    // console.log(item, "item.description");

      openPdfModal();

  };

  const onCloseMaterial = async () => {
    console.log("close");
    setModalVisible(false);
  };

  // const onPaymentSuccess = async (item) => {
  //   console.log("Payment Success-----105");
  //   setPaymentStatus(true);
  //   openPdfModal(item.fileUrl);
  // };



  if(studyMaterials.length === 0){
    return (
      <View style={styles.centered}>
        <Text>NO Study materials found</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <TouchableOpacity
        style={styles.centered}
        onPress={() => {
          setError(null);
          setLoading(true);
          setRefreshing(true);
          fetchStudyMaterials();
        }}
      >
        <Text>{error}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text
      style={{
        fontSize:20,
        textAlign:'center',
        fontWeight:'bold',
      }}
      >
        Free Study Materials
      </Text>
     
    

      <FlatList
        data={studyMaterials}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}
              onPress={() => router.push({
              pathname: '(routes)/pdfviewer',
              params: { pdfUri: item.fileUrl },
            })}
          >
          <Image
            style={{
              width: '80%',
              height: '80%',
              borderRadius: 5,
              alignSelf: "center",
              objectFit: "cover",
            }}
            source={{ uri: 'https://poainc.org/wp-content/uploads/2018/06/pdf-placeholder.png' }}
          />
          <View style={{ alignContent: 'flex-start' }}>
            <View style={{ justifyContent: "space-between", flexDirection: 'row' }}>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>{item.title}</Text>
              <Text style={{ fontSize: 14, fontWeight: "bold", paddingHorizontal: 8, textAlign: 'center', borderWidth: 2, borderRadius: 12 }}>
                {item.isPaid ? "paid" : 'free'}
              </Text>
            </View>

          </View>
        </TouchableOpacity>
          // <TouchableOpacity
          //   style={styles.item}
          //   // onPress={()=>{console.log(item.fileUrl, "item.description")}}

          //   // onPress={() => router.push({
          //   //   pathname: '(routes)/pdfviewer',
          //   //   params: { pdfUri: item.fileUrl },
          //   // })}

          //   onPress={() => {
          //     console.log(item.fileUrl, "item-----");
          //     setPdfUri(item.fileUrl);
          //     handleOpenMaterial();
          //   }}
          // >
          //   <Text
          //     style={{
          //       position: "absolute",
          //       top: 12,
          //       left:12,
          //       backgroundColor: "#2DC43E",
          //       color: "white",
          //       padding: 2,
          //       borderRadius: 3,
          //     }}
          //   >
          //     {item?.isPaid ? item?.price : "free"}
          //   </Text>
          //   <View
          //     style={{
          //       flexDirection: "column",
          //       alignItems: "center",
          //       gap: 5,
          //       marginTop: 24,
          //       height: 'auto',
          //     }}
          //   >
          //       <Image
          //           style={{
          //             width: '80%',
          //             height: '80%',
          //             borderRadius: 5,
          //             alignSelf: "center",
          //             objectFit: "cover",
          //           }}
          //           source={{ uri: 'https://poainc.org/wp-content/uploads/2018/06/pdf-placeholder.png' }}
          //         />

          //     <Text style={styles.title}>{item.title}</Text>
          //   </View>
          // </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({

    containercard: {
      // position: 'relative',
      backgroundColor: "white",
      marginBottom: 10,
      padding: 12,
  
      // minWidth: "49%",
      // maxWidth: "100%",
      marginHorizontal: 0,
      height: 200, // Ensure this is set to control the size

      // justifyContent: "center",
      borderRadius: 20,
      overflow: "hidden", // Ensure the borderRadius effect applies to children
      elevation: 4, // Adds shadow for Android
      shadowColor: "#000000", // Shadow color for iOS
      shadowOffset: { width: 0, height: 2 }, // Shadow direction and distance for iOS
      shadowOpacity: 0.2, // Shadow opacity for iOS
      shadowRadius: 3.84, // Shadow blur radius for iOS
  
    },

  container: {
    flex: 1,
    paddingTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 16,
  },
  item: {
    flex: 1,
    marginBottom: 16,
    flexDirection: "column",
    height: 240,
    maxWidth: "45%",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginTop: 20,

    backgroundColor: "rgb(235, 229, 229)",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StudyMaterialsScreen;

