import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { translations } from "../../constants/i18n";
import { Fonts } from "../../constants/theme";
import { useSettings } from "../../context/SettingsContext";

export default function KhatamLog() {
  const router = useRouter();
  const { theme, themeColor, khatamPlan, saveKhatamPlan, appLanguage } =
    useSettings();
  const t = translations[appLanguage];
  const [pagesRead, setPagesRead] = useState("");

  if (!khatamPlan) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{t.khatam.noPlan}</Text>
      </View>
    );
  }

  const handleLogProgress = async () => {
    const pages = parseInt(pagesRead, 10);
    if (isNaN(pages) || pages <= 0) {
      Alert.alert(t.common.invalidInput, t.common.invalidPages);
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

    if (updatedPlan.currentPage >= 604) {
      router.replace("/khatam/success");
    } else {
      Alert.alert(t.common.success, t.common.loggedSuccess);
      router.back();
    }
  };

  const handleDeletePlan = () => {
    Alert.alert(t.khatam.deleteConfirmTitle, t.khatam.deleteConfirmMsg, [
      {
        text: t.common.cancel,
        style: "cancel",
      },
      {
        text: t.common.delete,
        style: "destructive",
        onPress: async () => {
          await saveKhatamPlan(null);
          router.replace("/(tabs)");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t.khatam.logTitle,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: Fonts.heading },
        }}
      />

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {t.khatam.pagesReadToday}
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
            <Text style={[styles.unit, { color: theme.text }]}>
              {t.khatam.pages}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: themeColor }]}
          onPress={handleLogProgress}
        >
          <Text style={styles.createButtonText}>{t.khatam.updateProgress}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePlan}
        >
          <Text style={[styles.deleteButtonText, { color: "#ef4444" }]}>
            {t.khatam.deletePlan}
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
