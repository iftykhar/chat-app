import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from "react-native";

interface MessageInputProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  currentUser: "UserA" | "UserB";
}

export const MessageInput: React.FC<MessageInputProps> = ({ inputText, onChangeText, onSend, currentUser }) => {
  return (
    <View style={styles.inputOuterWrapper}>
      <View style={styles.inputContainerPill}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={onChangeText}
          placeholder={`Message as ${currentUser === "UserA" ? "User A" : "User B"}...`}
          placeholderTextColor="#6c7883"
          multiline
        />
      </View>
      <TouchableOpacity style={styles.sendFABButton} onPress={onSend}>
        <Text style={styles.sendFABText}>➔</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputOuterWrapper: { flexDirection: "row", paddingHorizontal: 8, paddingVertical: 8, backgroundColor: "#17212b", alignItems: "flex-end" },
  inputContainerPill: { flex: 1, backgroundColor: "#182533", borderWidth: 1, borderColor: "#101921", borderRadius: 22, paddingHorizontal: 16, paddingVertical: 3, marginRight: 8, maxHeight: 120, justifyContent: "center" },
  input: { color: "#fff", fontSize: 15.5, paddingVertical: 6 },
  sendFABButton: { justifyContent: "center", alignItems: "center", width: 44, height: 44, borderRadius: 22, backgroundColor: "#2481cc", elevation: 4 },
  sendFABText: { color: "#fff", fontWeight: "bold", fontSize: 15, transform: [{ translateY: -1 }] },
});