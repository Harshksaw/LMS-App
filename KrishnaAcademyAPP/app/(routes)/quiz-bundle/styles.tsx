import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "lightred",
  // },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noVideoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noVideoImage: {
    width: 400,
    height: 300,
    marginBottom: 10,
  },
  noVideoText: {
    fontSize: 25,

    color: "black",
    fontFamily: "Roboto",
    fontWeight: "bold",
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
    height: "70%",
    // height: height * 0.3,
  },
  nameContainer: {
    height: height * 0.1,
    justifyContent: "center",
    alignItems: "center",
    // marginVertical: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    // justifyContent: "flex-start",

    // flexDirection:'column-reverse',
    paddingLeft: 20,
    paddingRight: 30,
    gap: 20,
    paddingTop: 20,
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
