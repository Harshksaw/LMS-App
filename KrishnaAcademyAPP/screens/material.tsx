import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Material() {
  const [materials, setMaterials] = useState(null);
  const [loader, setLoader] = useState(false);
  const { loading, user } = useUser();
  const flatListRef = useRef();
  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await axios.get(
        `${SERVER_URI}/api/v1/study/getAllStudyMaterials`
      );
      setMaterials(res.data);
    };
    fetchMaterials();
  }, []);

  const dummyData = [
    {
      isPaid: false,
      _id: "66a288c8eda1fa521598b621",
      title: "har",
      description: "eeeeew",
      fileType: "application/pdf",
      fileUrl:
        "https://d33zqdivlk1hm.cloudfront.net/f86f6906-472d-47d9-8762-b6f08fb2df00-6737992597.pdf",
      createdAt: "2024-07-25T17:18:00.017Z",
      __v: 0,
    },
    {
      isPaid: true,
      _id: "66a288c8eda1fa521598b622",
      title: "har",
      description: "eeeeew",
      fileType: "application/pdf",
      fileUrl:
        "https://d33zqdivlk1hm.cloudfront.net/f86f6906-472d-47d9-8762-b6f08fb2df00-6737992597.pdf",
      createdAt: "2024-07-25T17:18:00.017Z",
      __v: 0,
    },
    {
      isPaid: true,
      _id: "66a288c8eda1fa521598b623",
      title: "har",
      description: "eeeeew",
      fileType: "application/pdf",
      fileUrl:
        "https://d33zqdivlk1hm.cloudfront.net/f86f6906-472d-47d9-8762-b6f08fb2df00-6737992597.pdf",
      createdAt: "2024-07-25T17:18:00.017Z",
      __v: 0,
    },
    {
      isPaid: false,
      _id: "66a288c8eda1fa521598b624",
      title: "har",
      description: "eeeeew",
      fileType: "application/pdf",
      fileUrl:
        "https://d33zqdivlk1hm.cloudfront.net/f86f6906-472d-47d9-8762-b6f08fb2df00-6737992597.pdf",
      createdAt: "2024-07-25T17:18:00.017Z",
      __v: 0,
    },
  ];
  return (
    <>
      {loader || loading ? (
        <Loader />
      ) : (
        <>
          <View style={{ flex: 1, padding: 16 }}>
            <FlatList
              ref={flatListRef}
              contentContainerStyle={{ width: "100%", gap: 0 }}
              columnWrapperStyle={{ gap: 8 }}
              data={dummyData}
              numColumns={2}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <Pressable style={styles.container}>
                  <Image
                    style={{
                      width: "80%",
                      height: "80%",
                      borderRadius: 5,
                      alignSelf: "center",
                      objectFit: "cover",
                    }}
                    source={{
                      uri: "https://poainc.org/wp-content/uploads/2018/06/pdf-placeholder.png",
                    }}
                  />
                  <View style={{ alignContent: "flex-start" }}>
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          paddingHorizontal: 8,
                          textAlign: "center",
                          borderWidth: 2,
                          borderRadius: 12,
                        }}
                      >
                        {item.isPaid ? "paid" : "free"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "white",
    marginBottom: 10,
    padding: 12,

    minWidth: "49%",
    maxWidth: "100%",
    marginHorizontal: 0,
    height: 200, // Ensure this is set to control the size
    alignItems: "start",
    justifyContent: "center",
    borderRadius: 20,
    overflow: "hidden", // Ensure the borderRadius effect applies to children
    elevation: 4, // Adds shadow for Android
    shadowColor: "#000000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow direction and distance for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 3.84, // Shadow blur radius for iOS
  },
});
