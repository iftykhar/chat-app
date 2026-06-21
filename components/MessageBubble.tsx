import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Message {
  id: string;
  text: string;
  sender: "UserA" | "UserB";
  timeString: string;
}

interface MessageBubbleProps {
  item: Message;
  isMe: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ item, isMe, isFirstInGroup, isLastInGroup }) => {
  const bubbleCornerStyles = isMe
    ? {
        borderTopRightRadius: isFirstInGroup ? 16 : 4,
        borderBottomRightRadius: isLastInGroup ? 16 : 4,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
      }
    : {
        borderTopLeftRadius: isFirstInGroup ? 16 : 4,
        borderBottomLeftRadius: isLastInGroup ? 16 : 4,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
      };

  return (
    <View style={[isMe ? styles.myBubbleRow : styles.theirBubbleRow, { marginBottom: isLastInGroup ? 8 : 2.5 }]}>
      {!isMe && (
        <View style={styles.avatarPlaceholderContainer}>
          {isLastInGroup ? (
            <View style={[styles.avatar, styles.theirAvatarBg]}>
              <Text style={styles.avatarText}>{item.sender.replace("User", "")}</Text>
            </View>
          ) : null}
        </View>
      )}

      <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble, bubbleCornerStyles]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <View style={styles.metaInfoRow}>
          <Text style={styles.timestamp}>{item.timeString}</Text>
          {isMe && <Text style={styles.checkmarkStatus}> ✓✓</Text>}
        </View>
      </View>

      {isMe && (
        <View style={styles.avatarPlaceholderContainer}>
          {isLastInGroup ? (
            <View style={[styles.avatar, styles.myAvatarBg]}>
              <Text style={styles.myAvatarText}>{item.sender.replace("User", "")}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  myBubbleRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end", width: "100%" },
  theirBubbleRow: { flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-end", width: "100%" },
  avatarPlaceholderContainer: { width: 34, alignItems: "center", justifyContent: "center", marginHorizontal: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", borderWidth: 1 },
  theirAvatarBg: { backgroundColor: "#182533", borderColor: "rgba(255, 255, 255, 0.08)" },
  myAvatarBg: { backgroundColor: "rgba(43, 82, 120, 0.4)", borderColor: "rgba(82, 136, 193, 0.4)" },
  avatarText: { color: "#7f91a4", fontSize: 11, fontWeight: "700" },
  myAvatarText: { color: "#84b3e6", fontSize: 11, fontWeight: "700" },
  messageBubble: { maxWidth: "75%", paddingHorizontal: 13, paddingVertical: 7.5, elevation: 2 },
  myBubble: { backgroundColor: "#2b5278", borderWidth: 0.5, borderColor: "#36618d" },
  theirBubble: { backgroundColor: "#182533", borderWidth: 0.5, borderColor: "#1e2c3a" },
  messageText: { fontSize: 15, color: "#fff", lineHeight: 20.5 },
  metaInfoRow: { flexDirection: "row", alignSelf: "flex-end", alignItems: "center", marginTop: 3, marginLeft: 18 },
  timestamp: { fontSize: 10, color: "#7f91a4" },
  checkmarkStatus: { fontSize: 10, color: "#64b5f6" },
});