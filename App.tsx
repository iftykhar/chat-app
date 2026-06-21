// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ListRenderItem
// } from 'react-native';
// import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
// import { db } from './firebase';

// interface Message {
//   id: string;
//   text: string;
//   sender: 'UserA' | 'UserB';
//   timestamp: number;
//   timeString: string;
// }

// export default function App() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState<string>('');
//   const [currentUser, setCurrentUser] = useState<'UserA' | 'UserB'>('UserB');
//   const flatListRef = useRef<FlatList>(null);

//   // Hook to establish the real-time cloud data stream
//   useEffect(() => {
//     const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const fetchedMessages = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })) as Message[];

//       setMessages(fetchedMessages);
//     });

//     // Clean up subscription listener on unmount
//     return () => unsubscribe();
//   }, []);

//   const sendMessage = async (): Promise<void> => {
//     if (!inputText.trim()) return;

//     const textToSend = inputText;
//     setInputText(''); // Reset input immediately for snappy user experience feedback

//     try {
//       await addDoc(collection(db, "chats"), {
//         text: textToSend,
//         sender: currentUser,
//         timestamp: Date.now(),
//         timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       });
//     } catch (error) {
//       console.error("Error writing message to cloud database: ", error);
//     }
//   };

//   const renderItem: ListRenderItem<Message> = ({ item }) => {
//     const isMe = item.sender === currentUser;
//     return (
//       <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
//         <Text style={styles.messageText}>{item.text}</Text>
//         <Text style={styles.timestamp}>{item.timeString}</Text>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* APP TOPBAR */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>DevRiser Live Chat</Text>
//         <TouchableOpacity
//           style={styles.switchButton}
//           onPress={() => setCurrentUser(currentUser === 'UserB' ? 'UserA' : 'UserB')}
//         >
//           <Text style={styles.switchText}>Role: {currentUser}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* STREAM LAYOUT LIST */}
//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
//       />

//       {/* INTERACTIVE CONTROLLER INPUT */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}
//       >

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             value={inputText}
//             onChangeText={setInputText}
//             placeholder="Type a message..."
//             placeholderTextColor="#888"
//           />
//           <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//             <Text style={styles.sendButtonText}>Send</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#121212' },
//   header: { padding: 16, backgroundColor: '#1f1f1f', borderBottomWidth: 1, borderBottomColor: '#2d2d2d', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   switchButton: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
//   switchText: { color: '#fff', fontSize: 12, fontWeight: '600' },
//   listContent: { padding: 16 },
//   messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginVertical: 6 },
//   myBubble: { backgroundColor: '#007AFF', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
//   theirBubble: { backgroundColor: '#2c2c2e', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
//   messageText: { fontSize: 16, color: '#fff' },
//   timestamp: { fontSize: 10, color: '#aaa', alignSelf: 'flex-end', marginTop: 4 },
//   inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#1f1f1f', alignItems: 'center' },
//   input: { flex: 1, backgroundColor: '#2c2c2e', color: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 12, fontSize: 16 },
//   sendButton: { backgroundColor: '#007AFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
//   sendButtonText: { color: '#fff', fontWeight: 'bold' }
// });

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
  ImageBackground, // 🌟 Add this import
} from "react-native";
// 1. Import the provider and the new Android-friendly SafeAreaView component
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

interface Message {
  id: string;
  text: string;
  sender: "UserA" | "UserB";
  timestamp: number;
  timeString: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<"UserA" | "UserB">("UserB");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (): Promise<void> => {
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText("");

    try {
      await addDoc(collection(db, "chats"), {
        text: textToSend,
        sender: currentUser,
        timestamp: Date.now(),
        timeString: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (error) {
      console.error("Error writing message to cloud database: ", error);
    }
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => {
    const isMe = item.sender === currentUser;
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.timeString}</Text>
      </View>
    );
  };

  return (
    // 2. Wrap your entire application structure inside the provider shell
    <SafeAreaProvider>
      {/* 3. This version of SafeAreaView applies custom inset padding to Android dynamically */}
      <SafeAreaView style={styles.container}>
        {/* HEADER BAR */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>DevRiser Live Chat</Text>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={() =>
              setCurrentUser(currentUser === "UserB" ? "UserA" : "UserB")
            }
          >
            <Text style={styles.switchText}>Role: {currentUser}</Text>
          </TouchableOpacity>
        </View>
        {/* 🌟 WHATSAPP GRAFFITI BACKGROUND WALLPAPER */}
        <ImageBackground
          source={{
            uri: "https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png",
          }}
          style={styles.wallpaper}
          resizeMode="repeat" // This tiles the graffiti doodle infinitely
        >
          {/* STREAM LAYOUT LIST */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        </ImageBackground>

        {/* INTERACTIVE INPUT CONTROLLER */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 60}
        >
          {/* <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View> */}
          {/* Find this section inside your KeyboardAvoidingView and swap it */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Message" // Telegram style placeholder
              placeholderTextColor="#6c7883"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              {/* Clean text arrow instead of bulky button shape */}
              <Text style={styles.sendButtonText}>➔</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#121212' },
//   header: { padding: 16, backgroundColor: '#1f1f1f', borderBottomWidth: 1, borderBottomColor: '#2d2d2d', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   switchButton: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
//   switchText: { color: '#fff', fontSize: 12, fontWeight: '600' },
//   listContent: { padding: 16 },
//   messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginVertical: 6 },
//   myBubble: { backgroundColor: '#007AFF', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
//   theirBubble: { backgroundColor: '#2c2c2e', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
//   messageText: { fontSize: 16, color: '#fff' },
//   timestamp: { fontSize: 10, color: '#aaa', alignSelf: 'flex-end', marginTop: 4 },
//   inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#1f1f1f', alignItems: 'center' },
//   input: { flex: 1, backgroundColor: '#2c2c2e', color: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 12, fontSize: 16 },
//   sendButton: { backgroundColor: '#007AFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
//   sendButtonText: { color: '#fff', fontWeight: 'bold' }
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b3c3d", // 🌟 Telegram Signature Dark Theme Base
  },
  wallpaper: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    padding: 16,
    backgroundColor: "#596979", // 🌟 Slightly lighter contrast header
    borderBottomWidth: 1,
    borderBottomColor: "#101921",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchButton: {
    backgroundColor: "#2481cc", // 🌟 Sleek Telegram Blue Accent
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  switchText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  myBubble: {
    backgroundColor: "#2481cc",
    alignSelf: "flex-end",

    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  theirBubble: {
    backgroundColor: "rgba(255,255,255,0.08)",
    alignSelf: "flex-start",

    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontSize: 15,
    color: "#fff",
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    color: "#7f91a4", // Desaturated gray-blue timestamp text
    alignSelf: "flex-end",
    marginTop: 3,
    marginLeft: 12,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#17212b", // Matched header bar background
    borderTopWidth: 1,
    borderTopColor: "#101921",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#0e1621", // Dark contrast background inset
    color: "#fff",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 15,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2481cc", // Circular action button launcher
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
