import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/Bubble.styles"; // Linked Styles sheet

interface Message {
  id: string;
  text: string;
  sender: string;
  timeString: string;
}

interface MessageBubbleProps {
  item: Message;
  isMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ item, isMe }) => {
  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowThem]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        {!isMe && <Text style={styles.senderName}>{item.sender.split("@")[0]}</Text>}
        
        <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextThem]}>
          {item.text}
        </Text>
        
        <View style={styles.footer}>
          <Text style={{ fontSize: 10, color: isMe ? "rgba(255,255,255,0.7)" : "#888", paddingHorizontal: 12, paddingBottom: 6, textAlign: "right" }}>
            {item.timeString} {isMe ? "✓✓" : ""}
          </Text>
        </View>
      </View>
    </View>
  );
};