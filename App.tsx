import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  StyleSheet
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { collection, addDoc, doc, setDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useAudioPlayer, AudioSource } from "expo-audio";
import { auth, db } from "./firebase";

import { SplashScreen } from "./components/SplashScreen";
import { LoginScreen } from "./components/LoginScreen";
import { MessageBubble } from "./components/MessageBubble";
import { styles } from "./styles/ChatScreen.styles";
import { Colors } from "./constants/Colors";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  timeString: string;
  status?: "sending" | "delivered" | "read";
}

// Test users for identity switching — both must exist in Firebase Auth
const TEST_USERS = ["test@devriser.com", "userb@devriser.com"];

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [remoteUserTyping, setRemoteUserTyping] = useState<boolean>(false);
  const [counterpartOnline, setCounterpartOnline] = useState<boolean>(false);
  const [switchTargetEmail, setSwitchTargetEmail] = useState<string | undefined>(undefined);

  const flatListRef = useRef<FlatList>(null);
  const isInitialMount = useRef<boolean>(true);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasTypingRef = useRef<boolean>(false);
  const messagesLengthRef = useRef<number>(0);
  const counterpartLastActive = useRef<number>(0);
  const onlineCheckInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const audioSource: AudioSource = { uri: "https://assets.mixkit.co/active_storage/sfx/2357/2357-84.wav" };
  const player = useAudioPlayer(audioSource);

  // Firebase Auth state listener — replaces the mock login/session pattern
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      // Clear switch target once user state changes
      if (authenticatedUser) {
        setSwitchTargetEmail(undefined);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Splash screen controls loading — it calls onFinish after its 3-second animation

  useEffect(() => {
    if (!user?.email) return;

    const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
      const fetched = snapshot.docs.map((docItem) => {
        const data = docItem.data();
        return {
          id: docItem.id,
          text: data.text,
          sender: data.sender,
          timestamp: data.timestamp,
          timeString: data.timeString,
          status: data.status || "delivered",
        } as Message;
      });

      if (!isInitialMount.current && fetched.length > messagesLengthRef.current) {
        const lastMessage = fetched[fetched.length - 1];
        if (lastMessage && lastMessage.sender !== user.email) {
          playIncomingPingSound();
        }
      }

      setMessages(fetched);
      messagesLengthRef.current = fetched.length;
      isInitialMount.current = false;
    });

    const unsubscribeTyping = onSnapshot(collection(db, "presence"), (snapshot) => {
      let isOpponentTyping = false;
      let counterpartLast = 0;
      snapshot.forEach((docItem) => {
        if (docItem.id !== user.email) {
          const data = docItem.data();
          if (data.typing === true) {
            isOpponentTyping = true;
          }
          if (data.lastActive) {
            counterpartLast = Math.max(counterpartLast, data.lastActive);
          }
        }
      });
      setRemoteUserTyping(isOpponentTyping);
      counterpartLastActive.current = counterpartLast;
      setCounterpartOnline(Date.now() - counterpartLast < 30000);
    });

    // Write initial presence on login/mount
    const updateOwnPresence = async () => {
      try {
        await setDoc(doc(db, "presence", user.email!), {
          lastActive: Date.now(),
          typing: wasTypingRef.current
        }, { merge: true });
      } catch (err) {
        console.error("Failed to update own presence:", err);
      }
    };

    updateOwnPresence();

    // Set up heartbeat to update lastActive every 15 seconds
    const heartbeatInterval = setInterval(() => {
      updateOwnPresence();
    }, 15000);

    // Start an interval to update online status every 10 seconds
    // (checks if lastActive timestamp is still within the 30-second window)
    onlineCheckInterval.current = setInterval(() => {
      if (counterpartLastActive.current > 0) {
        setCounterpartOnline(Date.now() - counterpartLastActive.current < 30000);
      }
    }, 10000);

    return () => {
      unsubscribeChats();
      unsubscribeTyping();
      clearInterval(heartbeatInterval);
      if (onlineCheckInterval.current) {
        clearInterval(onlineCheckInterval.current);
        onlineCheckInterval.current = null;
      }
    };
  }, [user?.email]);

  // Cleanup typing debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const playIncomingPingSound = () => {
    try {
      if (player) {
        player.seekTo(0);
        player.play();
      }
    } catch (error) {
      console.log("Audio feedback error:", error);
    }
  };

  const emitTypingStatus = async (isTyping: boolean) => {
    if (!user?.email) return;
    try {
      await setDoc(doc(db, "presence", user.email), {
        typing: isTyping,
        lastActive: Date.now()
      }, { merge: true });
    } catch (err) {
      console.error("Presence update failure:", err);
    }
  };

  const handleTextChange = (text: string) => {
    setInputText(text);

    if (!user?.email) return;

    const isCurrentlyEmpty = text.trim().length === 0;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isCurrentlyEmpty) {
      if (wasTypingRef.current) {
        emitTypingStatus(false);
        wasTypingRef.current = false;
      }
    } else if (!wasTypingRef.current) {
      emitTypingStatus(true);
      wasTypingRef.current = true;
    }

    if (!isCurrentlyEmpty) {
      typingTimeoutRef.current = setTimeout(() => {
        emitTypingStatus(false);
        wasTypingRef.current = false;
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user?.email) return;
    const textToSend = inputText.trim();
    setInputText("");

    try {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      wasTypingRef.current = false;
      await setDoc(doc(db, "presence", user.email), { typing: false }, { merge: true });

      await addDoc(collection(db, "chats"), {
        text: textToSend,
        sender: user.email,
        timestamp: Date.now(),
        timeString: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "delivered",
      });
    } catch (error) {
      console.error("Firestore transmission anomaly:", error);
    }
  };

  const getAlternateUser = (currentEmail: string): string => {
    const other = TEST_USERS.find((u) => u !== currentEmail);
    return other || TEST_USERS[0];
  };

  const handleSwitchUser = async () => {
    if (!user?.email) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    wasTypingRef.current = false;
    if (onlineCheckInterval.current) {
      clearInterval(onlineCheckInterval.current);
      onlineCheckInterval.current = null;
    }

    const alternateEmail = getAlternateUser(user.email);

    try {
      await setDoc(doc(db, "presence", user.email), { typing: false, lastActive: 0 }, { merge: true });
    } catch (err) {
      console.error("Presence cleanup error:", err);
    }

    setSwitchTargetEmail(alternateEmail);

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }

    isInitialMount.current = true;
    messagesLengthRef.current = 0;
  };

  const handleLogOut = async () => {
    if (user?.email) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      wasTypingRef.current = false;

      try {
        await setDoc(doc(db, "presence", user.email), { typing: false, lastActive: 0 }, { merge: true });
      } catch (err) {
        // Proceed with sign out even if presence update fails
        console.error("Presence cleanup error:", err);
      }
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }

    isInitialMount.current = true;
    messagesLengthRef.current = 0;
  };

  const displayName = user?.email?.split('@')[0].toUpperCase() || "USER";
  const counterpartEmail = user?.email ? getAlternateUser(user.email) : "";
  const counterpartDisplayName = counterpartEmail ? counterpartEmail.split('@')[0].toUpperCase() : "PEER";

  return (
    <SafeAreaProvider>
      {isAppLoading ? (
        <SplashScreen onFinish={() => setIsAppLoading(false)} />
      ) : !user ? (
        <LoginScreen
          initialEmail={switchTargetEmail}
        />
      ) : (
        <SafeAreaView style={styles.safe}>

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerName} numberOfLines={1}>
                {counterpartDisplayName}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <View style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: counterpartOnline ? Colors.online : Colors.surfaceHigh,
                }} />
                <Text style={[styles.headerSub, { fontSize: 12 }]}>
                  {counterpartOnline ? "Online" : "Offline"}
                </Text>
              </View>
            </View>

            {/* <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, marginRight: 2 }}>
              As: {displayName.toLowerCase()}
            </Text>
            <TouchableOpacity 
              style={{ backgroundColor: `${Colors.primary}14`, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }} 
              onPress={handleSwitchUser}
            >
              <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: "600" }}>🔄 Switch</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ backgroundColor: `${Colors.error}14`, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20 }} 
              onPress={handleLogOut}
            >
              <Text style={{ color: Colors.error, fontSize: 13, fontWeight: "600" }}>Sign Out</Text>
            </TouchableOpacity>
          </View> */}
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
              {/* ROUNDED AVATAR BOX WITH INITIALS */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: Colors.primary, // Using your theme's primary color as the backdrop
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 1
                  }}
                >
                  <Text
                    style={{
                      color: Colors.onPrimary || "#ffffff",
                      fontSize: 13,
                      fontWeight: "700",
                      textTransform: "uppercase"
                    }}
                  >
                    {displayName && displayName.trim().length > 0
                      ? displayName.trim().charAt(0)
                      : "?"}
                  </Text>
                </View>

                {/* Clean, subtle context label */}
                {/* <Text style={{ fontSize: 11, color: Colors.onSurfaceVariant, fontWeight: "500" }}>
                  Active Node
                </Text> */}
              </View>

              {/* ACTIONS GRAPHS */}
              <TouchableOpacity
                style={{ backgroundColor: `${Colors.primary}14`, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}
                onPress={handleSwitchUser}
              >
                <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: "600" }}>🔄 Switch</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ backgroundColor: `${Colors.error}14`, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20 }}
                onPress={handleLogOut}
              >
                <Text style={{ color: Colors.error, fontSize: 13, fontWeight: "600" }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* KeyboardAvoidingView */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.kav}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          >
            {/* Messages container */}
            <View style={{ flex: 1, backgroundColor: Colors.surface, position: "relative" }}>
              <ImageBackground
                source={require("./assets/wallpaper.png")}
                style={StyleSheet.absoluteFillObject}
                resizeMode="repeat"
                imageStyle={{ opacity: 0.06 }}
              />

              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <MessageBubble item={item} isMe={item.sender === user.email} />
                )}
              />

              {remoteUserTyping && (
                <View style={styles.typingRow}>
                  <Text style={styles.typingText}>
                    💬 Someone is typing...
                  </Text>
                </View>
              )}
            </View>

            {/* Input bar */}
            <View style={[styles.inputBar, { backgroundColor: Colors.surfaceLowest }]}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={handleTextChange}
                  placeholder="Type your message..."
                  placeholderTextColor={Colors.onSurfaceVariant}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    { backgroundColor: inputText.trim().length > 0 ? Colors.primary : Colors.surfaceHigh },
                    inputText.trim().length === 0 && styles.sendBtnDisabled,
                  ]}
                  onPress={handleSendMessage}
                >
                  <Text style={{
                    color: inputText.trim().length > 0 ? Colors.onPrimary : Colors.onSurfaceVariant,
                    fontWeight: "700",
                    fontSize: 14
                  }}>
                    ➔
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>

        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}
