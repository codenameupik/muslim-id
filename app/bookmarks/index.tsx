import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { Fonts } from "../../constants/theme";
import { useSettings } from "../../context/SettingsContext";

export default function BookmarksScreen() {
  const { theme, bookmarks, themeColor, removeBookmark } = useSettings();
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === "dark";

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          shadowColor: theme.text,
          shadowOpacity: isDark ? 0.3 : 0.08,
        },
      ]}
      onPress={() => router.push(`/surah/${item.surahIndex}?ayah=${item.ayah}`)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View
          style={[styles.iconContainer, { backgroundColor: themeColor + "15" }]}
        >
          <Ionicons name="bookmark" size={20} color={themeColor} />
        </View>

        <View style={styles.info}>
          <Text style={[styles.surahName, { color: theme.text }]}>
            {item.surahName}
          </Text>
          <Text style={[styles.ayahInfo, { color: theme.textSecondary }]}>
            Ayah {item.ayah}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => removeBookmark(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: "Bookmarks" }} />
      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="bookmark-outline"
            size={64}
            color={theme.textSecondary}
            style={{ opacity: 0.5 }}
          />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No bookmarks yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Save your favorite verses to read them later
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontFamily: Fonts.heading,
    marginBottom: 4,
  },
  ayahInfo: {
    fontSize: 14,
    fontFamily: Fonts.body,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Fonts.heading,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.body,
    textAlign: "center",
    lineHeight: 20,
  },
});
