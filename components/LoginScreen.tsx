import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { styles } from "../styles/AuthScreen.styles";
import { Colors } from "../constants/Colors";

interface LoginScreenProps {
  initialEmail?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ initialEmail }) => {
  const [email, setEmail] = useState(initialEmail || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password reset state
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Pre-fill email when switching users
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleAuthAction = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Input Error", "Please provide both an email and password.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      // On success, App.tsx's onAuthStateChanged listener picks up the new user automatically
    } catch (error: any) {
      let message = "Authentication failed. Please try again.";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        message = "Invalid email or password.";
      } else if (error.code === "auth/email-already-in-use") {
        message = "An account with this email already exists.";
      } else if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      } else if (error.message) {
        message = error.message;
      }
      Alert.alert("Authentication Error", message);
    } finally {
      setLoading(false);
    }
  };

  const openPasswordReset = () => {
    setResetEmail(email); // Pre-fill with whatever's in the email field
    setResetModalVisible(true);
  };

  const handlePasswordReset = async () => {
    const targetEmail = resetEmail.trim();
    if (!targetEmail) {
      Alert.alert("Missing Email", "Please enter your email address to receive a reset link.");
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setResetModalVisible(false);
      Alert.alert(
        "Reset Email Sent",
        `Check your inbox at ${targetEmail} for instructions to reset your password.`
      );
      setResetEmail("");
    } catch (error: any) {
      let message = "Failed to send reset email. Please try again.";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email address.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many requests. Please try again later.";
      } else if (error.message) {
        message = error.message;
      }
      Alert.alert("Reset Error", message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.logoRow}>
            <View style={[styles.logoBox, { backgroundColor: Colors.primary }]}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
                ➔
              </Text>
            </View>
            <Text style={styles.appName}>DevRiser</Text>
          </View>

          <Text style={styles.heading}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Text>
          <Text style={styles.subheading}>
            {isSignUp
              ? "Sign up to start chatting in real-time"
              : "Sign in to your secure chat network"}
          </Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <TextInput
                  style={[styles.input, { flex: 1, paddingRight: 50 }]}
                  placeholder={isSignUp ? "Min 6 characters" : "Enter your password"}
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 16,
                    height: "100%",
                    justifyContent: "center",
                  }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: Colors.primary,
                      fontWeight: "600",
                    }}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </Text>
                </TouchableOpacity>
              </View>

             
            </View>

            <View style={styles.btnWrapper}>
              <TouchableOpacity
                style={[styles.input, { backgroundColor: Colors.primary }]}
                onPress={handleAuthAction}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#ffffff",
                    }}
                  >
                    {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.toggleRow}
            >
              <Text style={styles.toggleText}>
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <Text style={styles.toggleLink}>
                  {isSignUp ? "Sign In" : "Create One"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ─── Password Reset Modal ─── */}
      <Modal
        visible={resetModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={resetOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ justifyContent: "center", flex: 1 }}
          >
            <View style={resetCard}>
              {/* Header */}
              <Text style={resetTitle}>Reset Password</Text>
              <Text style={resetSubtitle}>
                Enter your email address and we'll send you a link to reset your
                password.
              </Text>

              {/* Email input */}
              <View style={{ gap: 6, marginTop: 20 }}>
                <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#A0A0A0"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoFocus
                />
              </View>

              {/* Actions */}
              <View style={{ flexDirection: "row", gap: 10, marginTop: 24 }}>
                <TouchableOpacity
                  style={cancelBtn}
                  onPress={() => {
                    setResetModalVisible(false);
                    setResetEmail("");
                  }}
                  disabled={resetLoading}
                >
                  <Text style={cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={sendBtn}
                  onPress={handlePasswordReset}
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={sendBtnText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── Modal Styles ───
const resetOverlay: any = {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  paddingHorizontal: 24,
};

const resetCard: any = {
  backgroundColor: Colors.surfaceLowest,
  borderRadius: 20,
  padding: 28,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 24,
  elevation: 12,
};

const resetTitle: any = {
  fontSize: 20,
  fontWeight: "600",
  color: Colors.onSurface,
  letterSpacing: -0.3,
};

const resetSubtitle: any = {
  fontSize: 13,
  color: Colors.onSurfaceVariant,
  lineHeight: 18,
  marginTop: 6,
};

const cancelBtn: any = {
  flex: 1,
  paddingVertical: 12,
  borderRadius: 14,
  backgroundColor: Colors.surfaceLow,
  alignItems: "center",
  justifyContent: "center",
};

const cancelBtnText: any = {
  fontSize: 14,
  fontWeight: "500",
  color: Colors.onSurfaceVariant,
};

const sendBtn: any = {
  flex: 2,
  paddingVertical: 12,
  borderRadius: 14,
  backgroundColor: Colors.primary,
  alignItems: "center",
  justifyContent: "center",
};

const sendBtnText: any = {
  fontSize: 14,
  fontWeight: "600",
  color: Colors.onPrimary,
};
