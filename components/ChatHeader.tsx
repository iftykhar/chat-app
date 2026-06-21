import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

interface ChatHeaderProps {
  currentUser: "UserA" | "UserB";
  onSwitchUser: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ currentUser, onSwitchUser }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>DevRiser Live Workspace</Text>
        <View style={styles.statusRowContainer}>
          <View style={styles.onlineStatusPin} />
          <Text style={styles.headerSubtitle}>Active Connection Live</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.headerAvatarWrapper,
          currentUser === "UserA" ? styles.headerAvatarA : styles.headerAvatarB,
        ]}
        onPress={onSwitchUser}
      >
        <Text style={styles.headerAvatarText}>{currentUser === "UserA" ? "A" : "B"}</Text>
        <View style={styles.badgeOnlineHalo} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#17212b",
    borderBottomWidth: 1,
    borderBottomColor: "#101921",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  statusRowContainer: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  onlineStatusPin: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#00e676", marginRight: 6 },
  headerSubtitle: { color: "#5288c1", fontSize: 12, fontWeight: "400" },
  headerAvatarWrapper: { width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center", position: "relative", borderWidth: 1, elevation: 3 },
  headerAvatarA: { backgroundColor: "#2b5278", borderColor: "#5288c1" },
  headerAvatarB: { backgroundColor: "#213a53", borderColor: "#43729e" },
  headerAvatarText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  badgeOnlineHalo: { position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: 5, backgroundColor: "#00e676", borderWidth: 1.5, borderColor: "#17212b" },
});