

// import React, { useState, useEffect, useRef } from "react";
// import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, ImageBackground, Text } from "react-native";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { collection, addDoc, doc, setDoc, query, orderBy, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase";

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
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState<string>("");
//   const [currentUser, setCurrentUser] = useState<"UserA" | "UserB">("UserB");
//   const [remoteUserTyping, setRemoteUserTyping] = useState<boolean>(false);
//   const flatListRef = useRef<FlatList>(null);

//   // 1. Live Chat Stream Snapshot Listeners + Unsubscribe Cleanup
//   useEffect(() => {
//     const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
//     const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
//       const fetched = snapshot.docs.map((docItem) => ({
//         id: docItem.id,
//         ...docItem.data(),
//       })) as Message[];
//       setMessages(fetched);
//     });

//     // 2. Dynamic Live Tracking for Typing Indicators
//     const targetUser = currentUser === "UserA" ? "UserB" : "UserA";
//     const unsubscribeTyping = onSnapshot(doc(db, "presence", targetUser), (snapshot) => {
//       if (snapshot.exists()) {
//         setRemoteUserTyping(!!snapshot.data().typing);
//       } else {
//         setRemoteUserTyping(false);
//       }
//     });

//     return () => {
//       unsubscribeChats();
//       unsubscribeTyping();
//     };
//   }, [currentUser]);

//   // 3. Updates Personal Live Typing State on Value Alteration Changes
//   const handleTextChange = async (text: string) => {
//     setInputText(text);
//     try {
//       await setDoc(doc(db, "presence", currentUser), { typing: text.trim().length > 0 }, { merge: true });
//     } catch (err) {
//       console.error("Typing status state writing failure: ", err);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputText.trim()) return;
//     const textToSend = inputText.trim();
//     setInputText("");

//     try {
//       // Clear personal typing flag on send
//       await setDoc(doc(db, "presence", currentUser), { typing: false }, { merge: true });
      
//       await addDoc(collection(db, "chats"), {
//         text: textToSend,
//         sender: currentUser,
//         timestamp: Date.now(),
//         timeString: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       });
//     } catch (error) {
//       console.error("Database messaging write transaction failure: ", error);
//     }
//   };

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
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Platform, ImageBackground, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { collection, addDoc, doc, setDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase"; // Verified configurations reading your active persistent caches

import { SplashScreen } from "./components/SplashScreen";
import { ChatHeader } from "./components/ChatHeader";
import { MessageBubble } from "./components/MessageBubble";
import { MessageInput } from "./components/MessageInput";

interface Message {
  id: string;
  text: string;
  sender: "UserA" | "UserB";
  timestamp: number;
  timeString: string;
}

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<"UserA" | "UserB">("UserB");
  const [remoteUserTyping, setRemoteUserTyping] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  // Live Cloud Database Listeners initialization pipeline
  useEffect(() => {
    if (isAppLoading) return; // Wait until splash screen countdown finishes

    // Continuous dynamic network subscription synchronization
    const chatQuery = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    const unsubscribeChats = onSnapshot(chatQuery, (snapshot) => {
      const fetched = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as Message[];
      setMessages(fetched);
    });

    // Remote presence mapping listener
    const targetUser = currentUser === "UserA" ? "UserB" : "UserA";
    const unsubscribeTyping = onSnapshot(doc(db, "presence", targetUser), (snapshot) => {
      if (snapshot.exists()) {
        setRemoteUserTyping(!!snapshot.data().typing);
      } else {
        setRemoteUserTyping(false);
      }
    });

    // Lifecycle garbage tracking handler protection cleanups
    return () => {
      unsubscribeChats();
      unsubscribeTyping();
    };
  }, [isAppLoading, currentUser]);

  const handleTextChange = async (text: string) => {
    setInputText(text);
    if (isAppLoading) return;
    try {
      await setDoc(doc(db, "presence", currentUser), { typing: text.trim().length > 0 }, { merge: true });
    } catch (err) {
      console.error("Presence fault: ", err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText("");

    try {
      await setDoc(doc(db, "presence", currentUser), { typing: false }, { merge: true });
      await addDoc(collection(db, "chats"), {
        text: textToSend,
        sender: currentUser,
        timestamp: Date.now(),
        timeString: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (error) {
      console.error("Cloud database write failure: ", error);
    }
  };

  // Intercept view layer layout structure if loading clock is counting down
  if (isAppLoading) {
    return <SplashScreen onFinish={() => setIsAppLoading(false)} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ChatHeader 
          currentUser={currentUser} 
          onSwitchUser={() => setCurrentUser(currentUser === "UserA" ? "UserB" : "UserA")} 
        />

        <View style={styles.centerStageContainer}>
          <ImageBackground
            source={require("./assets/wallpaper.png")}
            style={StyleSheet.absoluteFillObject}
            resizeMode="repeat"
            imageStyle={{ opacity: 0.18 }}
          />
          
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 16, paddingBottom: 32 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item, index }) => {
              const isMe = item.sender === currentUser;
              const prev = messages[index - 1];
              const next = messages[index + 1];
              return (
                <MessageBubble
                  item={item}
                  isMe={isMe}
                  isFirstInGroup={!prev || prev.sender !== item.sender}
                  isLastInGroup={!next || next.sender !== item.sender}
                />
              );
            }}
          />

          {remoteUserTyping && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>
                {currentUser === "UserA" ? "User B" : "User A"} is typing...
              </Text>
            </View>
          )}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 60}
        >
          <MessageInput 
            inputText={inputText} 
            onChangeText={handleTextChange} 
            onSend={handleSendMessage} 
            currentUser={currentUser} 
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e1621" },
  centerStageContainer: { flex: 1, position: "relative", backgroundColor: "#0e1621" },
  typingContainer: { position: "absolute", bottom: 6, left: 14 },
  typingText: { color: "#5288c1", fontSize: 12, fontStyle: "italic" }
});