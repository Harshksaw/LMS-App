import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

import { Platform } from "react-native";

import * as Cellular from "expo-cellular";
import { collectDeviceData } from "@/utils/device.data";

export default function useUser() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState("");
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const deviceData = collectDeviceData();

    const subscription = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      const isUser = JSON.parse(user);
      if (accessToken && user) {
        setUser(isUser);
        setLoading(false);
      }
      setLoading(false);
    };
    subscription();
  }, [refetch]);

  return { loading, user, error, setRefetch, refetch };
}
