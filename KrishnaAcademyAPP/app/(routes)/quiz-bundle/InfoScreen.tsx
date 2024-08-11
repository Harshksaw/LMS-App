
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { styles } from "./styles";

const InfoScreen = ({data}:any) => (
    <ScrollView style={styles.tabContent}>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
  
          paddingVertical: 20,
        }}
      >
  
  
       {/* { console.log("🚀 ~ data------------:", data)} */}
  
        <Text style={styles.sectionTitle}>{data?.bundleName}</Text>
  
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
  
          
  
  
          <View style={styles.itemContainer}>
            <Ionicons name="extension-puzzle" size={24} color="black" />
            <Text style={styles.itemText}>Indian Legal Mastery Quiz</Text>
          </View>
          <View style={styles.itemContainer}>
            <Ionicons name="extension-puzzle" size={24} color="black" />
            <Text style={styles.itemText}>Indian Legal Mastery Quiz2</Text>
          </View>
          <View style={styles.itemContainer}>
            <Ionicons name="extension-puzzle" size={24} color="black" />
            <Text style={styles.itemText}>Indian Legal Mastery Quiz3</Text>
          </View>
          <View style={styles.itemContainer}>
            <Ionicons name="book-outline" size={24} color="black" />
            <Text style={styles.itemText}>IPS</Text>
          </View>
          <View style={styles.itemContainer}>
            <Ionicons name="book-outline" size={24} color="black" />
            <Text style={styles.itemText}>CRPC</Text>
          </View>
        </View>
      </View>
  
      <View>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            {data?.aboutDescription?.split("\n").map((paragraph, index) => {
              const isBulletPoint = paragraph.trim().startsWith("-");
              return (
                <Text
                  key={index}
                  style={isBulletPoint ? styles.bulletPoint : styles.paragraph}
                >
                  {isBulletPoint
                    ? `• ${paragraph.trim().substring(1).trim()}`
                    : paragraph.trim()}
                  {"\n"}
                </Text>
              );
            })}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
  
  export default InfoScreen;