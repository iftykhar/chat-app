import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/Bubble.styles";

interface MessageBubbleProps {
  item: {
    text: string;
    sender: string;
    timeString: string;
    status?: string;
  };
  isMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ item, isMe }) => {
  const renderStatusTicks = () => {
    if (!isMe) return null;

    switch (item.status) {
      case "sending":
        return (
          <Text style={styles.statusSending}>
            ✓
          </Text>
        );
      case "read":
        return (
          <Text style={styles.statusRead}>
            ✓✓
          </Text>
        );
      case "delivered":
      default:
        return (
          <Text style={styles.statusDelivered}>
            ✓✓
          </Text>
        );
    }
  };

  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowThem, { marginVertical: 4 }]}>
      <View 
        style={[
          styles.bubble, 
          isMe ? styles.bubbleMe : styles.bubbleThem,
          {
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 16,
            maxWidth: "75%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
            elevation: 1,
            backgroundColor: isMe ? "#2481cc" : "#ffffff", 
          }
        ]}
      >
        {!isMe && (
          <Text style={[styles.senderName, { color: "#2481cc", marginBottom: 2, fontWeight: "600", fontSize: 11 }]}>
            {item.sender.split('@')[0]}
          </Text>
        )}
        
        <Text style={[styles.msgText, { color: isMe ? "#ffffff" : "#2c3e50", fontSize: 15, lineHeight: 20 }]}>
          {item.text}
        </Text>
        
        <View style={[styles.footer, isMe ? styles.footerRight : styles.footerLeft]}>
          <Text style={[styles.timeText, isMe ? styles.timeMe : styles.timeThem]}>
            {item.timeString || "Just now"}
          </Text>
          {renderStatusTicks()}
        </View>
      </View>
    </View>
  );
};