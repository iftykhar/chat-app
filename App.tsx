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

import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  ListRenderItem
} from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase'; // Imports the database module you just configured

interface Message {
  id: string;
  text: string;
  sender: 'UserA' | 'UserB';
  timestamp: number;
  timeString: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<'UserA' | 'UserB'>('UserB');
  const flatListRef = useRef<FlatList>(null);

  // Hook to establish the real-time cloud data stream
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(fetchedMessages);
    });

    // Clean up subscription listener when app closes/unmounts
    return () => unsubscribe();
  }, []);

  const sendMessage = async (): Promise<void> => {
    if (!inputText.trim()) return;
    
    const textToSend = inputText;
    setInputText(''); // Clear input immediately for snappy, instant-response feel

    try {
      // Pushes the message object up into your live cloud Firestore database
      await addDoc(collection(db, "chats"), {
        text: textToSend,
        sender: currentUser,
        timestamp: Date.now(),
        timeString: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (error) {
      console.error("Error writing message to cloud database: ", error);
    }
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => {
    const isMe = item.sender === currentUser;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.timeString}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER BAR */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DevRiser Live Chat</Text>
        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setCurrentUser(currentUser === 'UserB' ? 'UserA' : 'UserB')}
        >
          <Text style={styles.switchText}>Role: {currentUser}</Text>
        </TouchableOpacity>
      </View>

      {/* STREAM LAYOUT LIST */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* INTERACTIVE INPUT CONTROLLER */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}
      >
        <View style={styles.inputContainer}>
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { padding: 16, backgroundColor: '#1f1f1f', borderBottomWidth: 1, borderBottomColor: '#2d2d2d', flexDirection: 'row', justifyProject: 'space-between', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  switchButton: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  switchText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  listContent: { padding: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginVertical: 6 },
  myBubble: { backgroundColor: '#007AFF', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  theirBubble: { backgroundColor: '#2c2c2e', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  messageText: { fontSize: 16, color: '#fff' },
  timestamp: { fontSize: 10, color: '#aaa', alignSelf: 'flex-end', marginTop: 4 },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#1f1f1f', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#2c2c2e', color: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 12, fontSize: 16 },
  sendButton: { backgroundColor: '#007AFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' }
});