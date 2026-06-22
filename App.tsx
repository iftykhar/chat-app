
// import React, { useState, useEffect, useRef } from "react";
// import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, ImageBackground, Text } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { collection, addDoc, doc, setDoc, query, orderBy, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase"; // Pulls in your caching-enabled credentials cleanly

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

//   // Dynamic Network Synchronization Loop
//   useEffect(() => {
//     if (isAppLoading) return; // Prevent network attachments from leaking while on loading view

//     // Dynamic Real-time messaging snapshot listener (Required Feature #2)
//     const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
//     const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
//       const fetched = snapshot.docs.map((docItem) => ({
//         id: docItem.id,
//         ...docItem.data(),
//       })) as Message[];
//       setMessages(fetched);
//     });

//     // Real-time remote indicator stream sync
//     const targetUser = currentUser === "UserA" ? "UserB" : "UserA";
//     const unsubscribeTyping = onSnapshot(doc(db, "presence", targetUser), (snapshot) => {
//       if (snapshot.exists()) {
//         setRemoteUserTyping(!!snapshot.data().typing);
//       } else {
//         setRemoteUserTyping(false);
//       }
//     });

//     // CRITICAL CLEANUP: Clear persistent socket hooks when swapping contexts (Required Feature #9)
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
//       console.error("Live presence tracking fault: ", err);
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
//       console.error("Database cloud engine write error: ", error);
//     }
//   };

//   // If loading, intercept and hold view container execution on splash sequence
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

import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

import { SplashScreen } from "./components/SplashScreen";
import { LoginScreen } from "./components/LoginScreen";
import { MessageBubble } from "./components/MessageBubble";

import { styles } from "./styles/ChatScreen.styles"; // Linked Styles sheet

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  timeString: string;
}

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (isAppLoading || !user) return;

    const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
      const fetched = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as Message[];
      setMessages(fetched);
    });

    return () => unsubscribeChats();
  }, [isAppLoading, user]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user) return;
    const textToSend = inputText.trim();
    setInputText("");

    try {
      await addDoc(collection(db, "chats"), {
        text: textToSend,
        sender: user.email,
        timestamp: Date.now(),
        timeString: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (error) {
      console.error("Firestore database connection fault: ", error);
    }
  };

  if (isAppLoading) {
    return <SplashScreen onFinish={() => setIsAppLoading(false)} />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        {/* Core Screen Header using ChatScreen Styles */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>{user.email}</Text>
            <Text style={styles.headerSub}>🟢 Cloud Connection Live</Text>
          </View>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: "#ffaaaa33" }]} onPress={() => signOut(auth)}>
            <Text style={{ color: "#ff4444", fontSize: 13, fontWeight: "600" }}>Exit</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.kav}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <MessageBubble item={item} isMe={item.sender === user.email} />
            )}
          />

          {/* Bottom Bar Input Area using ChatScreen Styles */}
          <View style={styles.inputBar}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#A0A0A0"
                multiline
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                <Text style={{ color: "#2481cc", fontWeight: "700" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}