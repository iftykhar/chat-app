
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { onAuthStateChanged, User, signOut } from "firebase/auth";
// import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
// import { auth, db } from "./firebase";

// import { SplashScreen } from "./components/SplashScreen";
// import { LoginScreen } from "./components/LoginScreen";
// import { MessageBubble } from "./components/MessageBubble";

// import { styles } from "./styles/ChatScreen.styles"; // Linked Styles sheet

// interface Message {
//   id: string;
//   text: string;
//   sender: string;
//   timestamp: number;
//   timeString: string;
// }

// export default function App() {
//   const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
//   const [user, setUser] = useState<User | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState<string>("");
//   const flatListRef = useRef<FlatList>(null);

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
//       setUser(authenticatedUser);
//     });
//     return () => unsubscribeAuth();
//   }, []);

//   useEffect(() => {
//     if (isAppLoading || !user) return;

//     const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
//     const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
//       const fetched = snapshot.docs.map((docItem) => ({
//         id: docItem.id,
//         ...docItem.data(),
//       })) as Message[];
//       setMessages(fetched);
//     });

//     return () => unsubscribeChats();
//   }, [isAppLoading, user]);

//   const handleSendMessage = async () => {
//     if (!inputText.trim() || !user) return;
//     const textToSend = inputText.trim();
//     setInputText("");

//     try {
//       await addDoc(collection(db, "chats"), {
//         text: textToSend,
//         sender: user.email,
//         timestamp: Date.now(),
//         timeString: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       });
//     } catch (error) {
//       console.error("Firestore database connection fault: ", error);
//     }
//   };

//   if (isAppLoading) {
//     return <SplashScreen onFinish={() => setIsAppLoading(false)} />;
//   }

//   if (!user) {
//     return <LoginScreen />;
//   }

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.safe}>
//         {/* Core Screen Header using ChatScreen Styles */}
//         <View style={styles.header}>
//           <View style={styles.headerInfo}>
//             <Text style={styles.headerName} numberOfLines={1}>{user.email}</Text>
//             <Text style={styles.headerSub}>🟢 Cloud Connection Live</Text>
//           </View>
//           <TouchableOpacity style={[styles.headerBtn, { backgroundColor: "#ffaaaa33" }]} onPress={() => signOut(auth)}>
//             <Text style={{ color: "#ff4444", fontSize: 13, fontWeight: "600" }}>Exit</Text>
//           </TouchableOpacity>
//         </View>

//         <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.kav}>
//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={styles.messageList}
//             onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//             renderItem={({ item }) => (
//               <MessageBubble item={item} isMe={item.sender === user.email} />
//             )}
//           />

//           {/* Bottom Bar Input Area using ChatScreen Styles */}
//           <View style={styles.inputBar}>
//             <View style={styles.inputRow}>
//               <TextInput
//                 style={styles.textInput}
//                 value={inputText}
//                 onChangeText={setInputText}
//                 placeholder="Type a message..."
//                 placeholderTextColor="#A0A0A0"
//                 multiline
//               />
//               <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
//                 <Text style={{ color: "#2481cc", fontWeight: "700" }}>Send</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }



// import React, { useState, useEffect, useRef } from "react";
// import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, ImageBackground, Text } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { collection, addDoc, doc, setDoc, query, orderBy, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase"; // Verified configurations reading your active persistent caches

// import { SplashScreen } from "./components/SplashScreen";
// import { ChatHeader } from "./components/ChatHeader";
// import { MessageBubble } from "./components/MessageBubble";
// import { MessageInput } from "./components/MessageInput";

// interface Message {
//   id: string;
//   text: string;
//   sender: "UserA" | "UserB";
//   timestamp: number;
//   timeString: string;
// }

// export default function App() {
//   const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState<string>("");
//   const [currentUser, setCurrentUser] = useState<"UserA" | "UserB">("UserB");
//   const [remoteUserTyping, setRemoteUserTyping] = useState<boolean>(false);
//   const flatListRef = useRef<FlatList>(null);

//   // Live Cloud Database Listeners initialization pipeline
//   useEffect(() => {
//     if (isAppLoading) return; // Wait until splash screen countdown finishes

//     // Continuous dynamic network subscription synchronization
//     const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
//     const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
//       const fetched = snapshot.docs.map((docItem) => ({
//         id: docItem.id,
//         ...docItem.data(),
//       })) as Message[];
//       setMessages(fetched);
//     });

//     // Remote presence mapping listener
//     const targetUser = currentUser === "UserA" ? "UserB" : "UserA";
//     const unsubscribeTyping = onSnapshot(doc(db, "presence", targetUser), (snapshot) => {
//       if (snapshot.exists()) {
//         setRemoteUserTyping(!!snapshot.data().typing);
//       } else {
//         setRemoteUserTyping(false);
//       }
//     });

//     // Lifecycle garbage tracking handler protection cleanups
//     return () => {
//       unsubscribeChats();
//       unsubscribeTyping();
//     };
//   }, [isAppLoading, currentUser]);

//   const handleTextChange = async (text: string) => {
//     setInputText(text);
//     if (isAppLoading) return;
//     try {
//       await setDoc(doc(db, "presence", currentUser), { typing: text.trim().length > 0 }, { merge: true });
//     } catch (err) {
//       console.error("Presence fault: ", err);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputText.trim()) return;
//     const textToSend = inputText.trim();
//     setInputText("");

//     try {
//       await setDoc(doc(db, "presence", currentUser), { typing: false }, { merge: true });
//       await addDoc(collection(db, "chats"), {
//         text: textToSend,
//         sender: currentUser,
//         timestamp: Date.now(),
//         timeString: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       });
//     } catch (error) {
//       console.error("Cloud database write failure: ", error);
//     }
//   };

//   // Intercept view layer layout structure if loading clock is counting down
//   if (isAppLoading) {
//     return <SplashScreen onFinish={() => setIsAppLoading(false)} />;
//   }

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         <ChatHeader 
//           currentUser={currentUser} 
//           onSwitchUser={() => setCurrentUser(currentUser === "UserA" ? "UserB" : "UserA")} 
//         />

//         <View style={styles.centerStageContainer}>
//           <ImageBackground
//             source={require("./assets/wallpaper.png")}
//             style={StyleSheet.absoluteFillObject}
//             resizeMode="repeat"
//             imageStyle={{ opacity: 0.18 }}
//           />
          
//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 16, paddingBottom: 32 }}
//             onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//             renderItem={({ item, index }) => {
//               const isMe = item.sender === currentUser;
//               const prev = messages[index - 1];
//               const next = messages[index + 1];
//               return (
//                 <MessageBubble
//                   item={item}
//                   isMe={isMe}
//                   isFirstInGroup={!prev || prev.sender !== item.sender}
//                   isLastInGroup={!next || next.sender !== item.sender}
//                 />
//               );
//             }}
//           />

//           {remoteUserTyping && (
//             <View style={styles.typingContainer}>
//               <Text style={styles.typingText}>
//                 {currentUser === "UserA" ? "User B" : "User A"} is typing...
//               </Text>
//             </View>
//           )}
//         </View>

//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 60}
//         >
//           <MessageInput 
//             inputText={inputText} 
//             onChangeText={handleTextChange} 
//             onSend={handleSendMessage} 
//             currentUser={currentUser} 
//           />
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#0e1621" },
//   centerStageContainer: { flex: 1, position: "relative", backgroundColor: "#0e1621" },
//   typingContainer: { position: "absolute", bottom: 6, left: 14 },
//   typingText: { color: "#5288c1", fontSize: 12, fontStyle: "italic" }
// });




// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase"; // Keep utilizing your real working Firestore database!

// import { SplashScreen } from "./components/SplashScreen";
// import { LoginScreen } from "./components/LoginScreen";
// import { MessageBubble } from "./components/MessageBubble";
// import { styles } from "./styles/ChatScreen.styles";

// interface Message {
//   id: string;
//   text: string;
//   sender: string;
//   timestamp: number;
//   timeString: string;
// }

// export default function App() {
//   const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
//   const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState<string>("");
//   const flatListRef = useRef<FlatList>(null);

//   useEffect(() => {
//     // Quickly clear splash screen during local mode
//     setIsAppLoading(false);
//   }, []);

//   // Real-time message streaming from Firestore remains fully functional!
//   useEffect(() => {
//     if (!currentUserEmail) return;

//     const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
//     const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
//       const fetched = snapshot.docs.map((docItem) => ({
//         id: docItem.id,
//         ...docItem.data(),
//       })) as Message[];
//       setMessages(fetched);
//     });

//     return () => unsubscribeChats();
//   }, [currentUserEmail]);

//   const handleSendMessage = async () => {
//     if (!inputText.trim() || !currentUserEmail) return;
//     const textToSend = inputText.trim();
//     setInputText("");

//     try {
//       await addDoc(collection(db, "chats"), {
//         text: textToSend,
//         sender: currentUserEmail, // Uses your simulated account identifier
//         timestamp: Date.now(),
//         timeString: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       });
//     } catch (error) {
//       console.error("Firestore submission issue: ", error);
//     }
//   };

//   if (isAppLoading) {
//     return <SplashScreen onFinish={() => {}} />;
//   }

//   // Pass custom profile hook straight into the screen layer
//   if (!currentUserEmail) {
//     return <LoginScreen onMockLoginSuccess={(email) => setCurrentUserEmail(email)} />;
//   }

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.safe}>
//         <View style={styles.header}>
//           <View style={styles.headerInfo}>
//             <Text style={styles.headerName} numberOfLines={1}>{currentUserEmail}</Text>
//             <Text style={styles.headerSub}>🟢 Local Sandbox Node Active</Text>
//           </View>
//           <TouchableOpacity 
//             style={[styles.headerBtn, { backgroundColor: "#ffaaaa22", borderWidth: 1, borderColor: "rgba(255,0,0,0.2)" }]} 
//             onPress={() => setCurrentUserEmail(null)} // Clear session simulation state
//           >
//             <Text style={{ color: "#ff4444", fontSize: 13, fontWeight: "600" }}>Log Out</Text>
//           </TouchableOpacity>
//         </View>

//         <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.kav}>
//           <FlatList
//             ref={flatListRef}
//             data={messages}
//             keyExtractor={(item) => item.id}
//             contentContainerStyle={styles.messageList}
//             onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//             renderItem={({ item }) => (
//               <MessageBubble item={item} isMe={item.sender === currentUserEmail} />
//             )}
//           />

//           <View style={styles.inputBar}>
//             <View style={styles.inputRow}>
//               <TextInput
//                 style={styles.textInput}
//                 value={inputText}
//                 onChangeText={setInputText}
//                 placeholder="Type a message..."
//                 placeholderTextColor="#A0A0A0"
//                 multiline
//               />
//               <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
//                 <Text style={{ color: "#2481cc", fontWeight: "700" }}>Send</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }



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
import { useAudioPlayer, AudioSource } from "expo-audio";
import { db } from "./firebase";

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

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [remoteUserTyping, setRemoteUserTyping] = useState<boolean>(false);
  
  const flatListRef = useRef<FlatList>(null);
  const isInitialMount = useRef<boolean>(true);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasTypingRef = useRef<boolean>(false);

  const audioSource: AudioSource = { uri: "https://assets.mixkit.co/active_storage/sfx/2357/2357-84.wav" };
  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    setIsAppLoading(false);
  }, []);

  useEffect(() => {
    if (!currentUserEmail) return;

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

      if (!isInitialMount.current && fetched.length > messages.length) {
        const lastMessage = fetched[fetched.length - 1];
        if (lastMessage && lastMessage.sender !== currentUserEmail) {
          playIncomingPingSound();
        }
      }
      
      setMessages(fetched);
      isInitialMount.current = false;
    });

    const unsubscribeTyping = onSnapshot(collection(db, "presence"), (snapshot) => {
      let isOpponentTyping = false;
      snapshot.forEach((docItem) => {
        if (docItem.id !== currentUserEmail && docItem.data().typing === true) {
          isOpponentTyping = true;
        }
      });
      setRemoteUserTyping(isOpponentTyping);
    });

    return () => {
      unsubscribeChats();
      unsubscribeTyping();
    };
  }, [currentUserEmail, messages.length]);

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
    if (!currentUserEmail) return;
    try {
      await setDoc(doc(db, "presence", currentUserEmail), { 
        typing: isTyping,
        lastActive: Date.now()
      }, { merge: true });
    } catch (err) {
      console.error("Presence update failure:", err);
    }
  };

  const handleTextChange = (text: string) => {
    setInputText(text);

    if (!currentUserEmail) return;

    const isCurrentlyEmpty = text.trim().length === 0;

    // Clear any pending debounce timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isCurrentlyEmpty) {
      if (wasTypingRef.current) {
        // Text became empty → immediately clear typing status
        emitTypingStatus(false);
        wasTypingRef.current = false;
      }
    } else if (!wasTypingRef.current) {
      // Text went from empty to non-empty → immediately emit typing: true
      emitTypingStatus(true);
      wasTypingRef.current = true;
    }

    // Always set debounce when there's text (either starting or continuing)
    if (!isCurrentlyEmpty) {
      typingTimeoutRef.current = setTimeout(() => {
        emitTypingStatus(false);
        wasTypingRef.current = false;
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentUserEmail) return;
    const textToSend = inputText.trim();
    setInputText("");

    try {
      // Clear any pending typing debounce before sending
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      wasTypingRef.current = false;
      await setDoc(doc(db, "presence", currentUserEmail), { typing: false }, { merge: true });
      
      await addDoc(collection(db, "chats"), {
        text: textToSend,
        sender: currentUserEmail,
        timestamp: Date.now(),
        timeString: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "delivered",
      });
    } catch (error) {
      console.error("Firestore transmission anomaly:", error);
    }
  };

  const handleSwitchUser = async () => {
    if (!currentUserEmail) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    wasTypingRef.current = false;
    await setDoc(doc(db, "presence", currentUserEmail), { typing: false }, { merge: true });
    
    if (currentUserEmail === "usera@devriser.com") {
      setCurrentUserEmail("userb@devriser.com");
    } else {
      setCurrentUserEmail("usera@devriser.com");
    }
    isInitialMount.current = true;
  };

  const handleLogOut = async () => {
    if (currentUserEmail) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      wasTypingRef.current = false;
      await setDoc(doc(db, "presence", currentUserEmail), { typing: false }, { merge: true });
    }
    setCurrentUserEmail(null);
    isInitialMount.current = true;
  };

  if (isAppLoading) {
    return <SplashScreen onFinish={() => {}} />;
  }

  if (!currentUserEmail) {
    return <LoginScreen onMockLoginSuccess={(email) => setCurrentUserEmail(email)} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        
        {/* HEADER using stylesheet tokens */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>
              {currentUserEmail.split('@')[0].toUpperCase()}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.online }} />
              <Text style={[styles.headerSub, { fontSize: 12 }]}>Active Sync Channel</Text>
            </View>
          </View>
          
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <TouchableOpacity 
              style={{ backgroundColor: `${Colors.primary}14`, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }} 
              onPress={handleSwitchUser}
            >
              <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: "600" }}>🔄 Identity Swap</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ backgroundColor: `${Colors.error}14`, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20 }} 
              onPress={handleLogOut}
            >
              <Text style={{ color: Colors.error, fontSize: 13, fontWeight: "600" }}>Leave</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* KeyboardAvoidingView — cross-platform safe layout
            iOS: padding behavior with offset for header + safe area
            Android: height behavior (wraps content above keyboard) */}
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
                <MessageBubble item={item} isMe={item.sender === currentUserEmail} />
              )}
            />

            {remoteUserTyping && (
              <View style={styles.typingRow}>
                <Text style={styles.typingText}>
                  💬 Opponent node is typing...
                </Text>
              </View>
            )}
          </View>

          {/* Input bar using stylesheet tokens */}
          <View style={[styles.inputBar, { backgroundColor: Colors.surfaceLowest }]}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={handleTextChange}
                placeholder="Type your secure message..."
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
    </SafeAreaProvider>
  );
}