import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { styles } from "./styles";

const InfoScreen = ({ data }: any) => (
  <ScrollView style={styles.tabContent}>
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
    <View
      style={{
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",

        paddingVertical: 20,
      }}
    >
      <Text style={styles.sectionTitle}>{data?.bundleName}</Text>

      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}
      >
        {data?.quizes?.map((quiz, index) => (
          <View key={index} style={styles.itemContainer}>
            <Ionicons name="extension-puzzle" size={24} color="black" />
            <Text style={styles.itemText}>{quiz.name}</Text>
          </View>
        ))}

        {data?.studyMaterials?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Study Materials</Text>
            {data.studyMaterials.map((material, index) => (
              <View key={index} style={styles.itemContainer}>
                <Ionicons name="book-outline" size={24} color="black" />
                <Text style={styles.itemText}>{material.title}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  </ScrollView>
);

export default InfoScreen;
