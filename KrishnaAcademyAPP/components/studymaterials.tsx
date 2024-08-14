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

import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import PDFViewerModal from "../app/(routes)/pdfviewer";
import { Image } from "expo-image";
import PaymentComponent from "./Payment/PaymentComponent";

interface StudyMaterial {
  _id: string;
  title: string;
  description: string;
  // Add other fields as necessary
}

const StudyMaterialsList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPdfUri, setSelectedPdfUri] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<boolean | null>(false);
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
      // console.log(response.data, "---");
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
    if (paymentStatus) {
      openPdfModal();
      console.log("Payment Success-----1051");
    } else {
      console.log("Payment required to open material");
    }
  };

  const onCloseMaterial = async () => {
    console.log("close");
    setModalVisible(false);
  };

  const onPaymentSuccess = async (item) => {
    console.log("Payment Success-----105");
    setPaymentStatus(true);
    openPdfModal(item.fileUrl);
  };

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
      <PaymentComponent
        isVisible={isModalVisible}
        onClose={onCloseMaterial}
        onPaymentSuccess={() => onPaymentSuccess(selectedPdfUri)}
        itemType="Study Material"
        itemPrice="100"
        handlePayment={() => console.log("Payment done")}
        handleClose={closePdfModal}
      />

      <FlatList
        data={studyMaterials}
        numColumns={3}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            // onPress={()=>{console.log(item.fileUrl, "item.description")}}

            // onPress={() => router.push({
            //   pathname: '(routes)/pdfviewer',
            //   params: { pdfUri: item.fileUrl },
            // })}

            onPress={() => {
              console.log(item.fileUrl, "item-----");
              setPdfUri(item.fileUrl);
              handleOpenMaterial();
            }}
          >
            <Text
              style={{
                position: "absolute",
                top: 5,
                left: 5,
                backgroundColor: "#2DC43E",
                color: "white",
                padding: 2,
                borderRadius: 3,
              }}
            >
              {item?.isPaid ? item?.price : "free"}
            </Text>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                height: 100,
              }}
            >
              {/* <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 5,
                  alignSelf: "center",
                  objectFit: "cover",
                }}
                source={

                  {
                    uri: "https://img.freepik.com/free-vector/realistic-wooden-brown-judge-gavel_88138-139.jpg?size=626&ext=jpg&ga=GA1.1.1387862008.1722622005&semt=sph",
                  }
                }


              /> */}
              <Image
               style={{
                width: 100,
                height: 100,
                borderRadius: 5,
                alignSelf: "center",
                objectFit: "cover",
              }}
                source={{
                  uri: "https://img.freepik.com/free-vector/realistic-wooden-brown-judge-gavel_88138-139.jpg?size=626&ext=jpg&ga=GA1.1.1387862008.1722622005&semt=sph",
                }}
              />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
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
    height: 120,
    maxWidth: "30%",
    gap: 10,
    padding: 10,
    margin: 10,

    backgroundColor: "rgb(233, 221, 221)1)",
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

export default StudyMaterialsList;

{
  /* <View
style={{
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
}}
>


<TouchableOpacity
  onPress={() => {
    setRefreshing(!refreshing);
  }}
>
  <Text style={styles.heading}>Study Materials</Text>
</TouchableOpacity>
<TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "(routes)/studymaterials",
      params: { study: JSON.stringify(studyMaterials) },
    })
  }
>
  <Ionicons name="arrow-forward" size={30} color="gray" />
</TouchableOpacity>
</View> */
}
