import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

import { Platform } from "react-native";

import * as Cellular from "expo-cellular";

export const collectDeviceData = async () => {
  try {
    var carrierName = await Cellular.getCarrierNameAsync();

    const deviceData = {
      deviceName: Device.modelName,
      systemName: Device.osName,
      systemVersion: Device.osVersion,
      carrier: carrierName,
    };
    return deviceData;
  } catch (error) {
    console.error("Error collecting device data:", error);
    return null;
  }
};
