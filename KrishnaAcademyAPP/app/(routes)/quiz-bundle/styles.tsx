import { Dimensions, StyleSheet } from "react-native";



const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "lightred",
    },
    drawerContainer: {
      flexDirection: "row",
      height: height * 0.4,
    },
    descriptionContainer: {
      backgroundColor: "#f9f9f9", // Very light gray background for the description section
      padding: 15,
      borderRadius: 5,
    },
    description: {
      fontSize: 16,
      color: "#444444", // Dark gray text color
    },
    drawerStyle: {
      width: width * 0.5,
    },
    screen: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    paragraph: {
      marginBottom: 10,
    },
    image: {
      width: "100%",
      height: "80%",
      // height: height * 0.3,
    },
    nameContainer: {
      height: height * 0.1,
      justifyContent: "center",
      alignItems: "center",
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
    },
    tabContent: {
      flex: 1,
      // justifyContent: "flex-start",
      // alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 10,
      marginBottom: 0,
      // backgroundColor: "lightblue",
  
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "left",
      marginVertical: 10,
    },
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 5,
    },
    itemText: {
      marginLeft: 10,
      fontSize: 16,
    },
  
    bulletPoint: {
      marginBottom: 10,
      marginLeft: 10,
      fontSize: 16,
      color: "#333333", // Dark gray text color
    },
    tabContainer: {
      flex: 1,
    },
    slide: {
      justifyContent: "center",
      alignItems: "center",
    },
  
    slideTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
    },
  });
  