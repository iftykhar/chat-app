import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { styles } from "../styles/AuthScreen.styles"; // Linked Styles sheet

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuthAction = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please input your credentials fully.");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (error: any) {
      Alert.alert("Authentication Failure", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.logoRow}>
            <View style={[styles.logoBox, { backgroundColor: "#2481cc" }]}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>➔</Text>
            </View>
            <Text style={styles.appName}>DevRiser</Text>
          </View>

          <Text style={styles.heading}>{isSignUp ? "Get Started" : "Welcome Back"}</Text>
          <Text style={styles.subheading}>Secure cloud database network node configuration</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Min 6 characters"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.btnWrapper}>
              <TouchableOpacity style={styles.input} onPress={handleAuthAction} disabled={loading}>
                {loading ? <ActivityIndicator color="#000" /> : <Text style={{ textAlign: "center", fontWeight: "600" }}>{isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}</Text>}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.toggleRow}>
              <Text style={styles.toggleText}>
                {isSignUp ? "Already have an account? " : "New to the platform? "}
                <Text style={styles.toggleLink}>{isSignUp ? "Log In" : "Register"}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};