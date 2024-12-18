import { Dimensions, StyleSheet } from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const { width: screenWidth } = Dimensions.get("window");
const carouselHeight = (screenWidth * 9) / 16; // Calculate height based on 16:9 aspect ratio

export const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    height: carouselHeight,
    marginHorizontal: 12,
    flex: 1,
    borderRadius: 7,
    overflow: "hidden",
  },

  slide: {
    flex: 1,
    width: 420,
    height: 250,
  },

  background: {
    width: "100%",
    height: hp("27"),
    resizeMode: "stretch",
    zIndex: 1,
  },

  dot: {
    backgroundColor: "#e9e9e9",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: "#ED3137",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },

  backgroundView: {
    position: "absolute",
    zIndex: 5,
    paddingHorizontal: 18,
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },

  backgroundViewContainer: {
    width: responsiveWidth(45),
    height: responsiveWidth(30),
    marginTop: -50,
  },

  backgroundViewText: {
    color: "white",
    fontSize: hp("2.7%"),
  },

  backgroundViewOffer: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 5,
  },

  backgroundViewImage: {
    width: wp("38%"),
    height: hp("22%"),
    top: -15,
  },

  backgroundViewButtonContainer: {
    borderWidth: 1.1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    width: 109,
    height: 32,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  backgroundViewButtonText: {
    color: "#FFFF",
  },
});
