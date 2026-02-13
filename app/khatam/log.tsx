import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Fonts } from "../../constants/theme";
import { useSettings } from "../../context/SettingsContext";

export default function KhatamLog() {
  const router = useRouter();
  const { theme, themeColor, khatamPlan, saveKhatamPlan } = useSettings();
  const [pagesRead, setPagesRead] = useState("");

  if (!khatamPlan) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>No active plan found.</Text>
      </View>
    );
  }

  const handleLogProgress = async () => {
    const pages = parseInt(pagesRead, 10);
    if (isNaN(pages) || pages <= 0) {
      Alert.alert("Invalid Input", "Please enter valid number of pages.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newHistory = [
      ...khatamPlan.history.filter((h) => h.date !== today),
      { date: today, pagesRead: pages },
    ];

    const updatedPlan = {
      ...khatamPlan,
      currentPage: (khatamPlan.currentPage || 0) + pages,
      history: newHistory,
    };

    await saveKhatamPlan(updatedPlan);
    Alert.alert("Success", `Logged ${pages} pages!`);
    router.back();
  };

  const handleDeletePlan = () => {
    Alert.alert(
      "Delete Plan",
      "Are you sure you want to delete your current Khatam plan? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await saveKhatamPlan(null);
            router.replace("/(tabs)");
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Log Progress</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Pages Read Today
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border },
              ]}
              value={pagesRead}
              onChangeText={setPagesRead}
              keyboardType="number-pad"
              autoFocus
            />
            <Text style={[styles.unit, { color: theme.text }]}>Pages</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: themeColor }]}
          onPress={handleLogProgress}
        >
          <Text style={styles.createButtonText}>Update Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePlan}
        >
          <Text style={[styles.deleteButtonText, { color: "#ef4444" }]}>
            Delete Plan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.heading,
  },
  content: {
    flex: 1,
  },
  card: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: Fonts.body,
    marginRight: 12,
  },
  unit: {
    fontSize: 16,
    fontFamily: Fonts.body,
  },
  createButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    marginBottom: 16,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  deleteButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
});
