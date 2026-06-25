import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Animated, Platform, Image } from "react-native";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [countdown, setCountdown] = useState<number>(3); // 3 seconds splash clock
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade into the brand emblem smoothly
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Graceful fade out before passing back orchestrator authority
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => onFinish());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fadeAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.logoImage}
        />
        <Text style={styles.brandTitle}>DevRiser Studio</Text>
        <Text style={styles.brandSubtitle}>Secure Messaging Protocol</Text>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#5288c1" style={{ marginBottom: 12 }} />
          <Text style={styles.timerText}>Connecting to cloud network in {countdown}s...</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0e1621", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  content: { 
    alignItems: "center", 
    width: "100%" 
  },
  logoBadge: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: "#2481cc", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 16, 
    elevation: 6 
  },
  logoImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 20, 
    marginBottom: 16,
  },
  logoText: { 
    color: "#fff", 
    fontSize: 32, 
    fontWeight: "bold" 
  },
  brandTitle: { 
    color: "#fff", 
    fontSize: 24, 
    fontWeight: "700", 
    letterSpacing: 0.5 
  },
  brandSubtitle: { 
    color: "#5288c1", 
    fontSize: 12, 
    marginTop: 4, 
    textTransform: "uppercase", 
    letterSpacing: 1 
  },
  loaderContainer: { 
    marginTop: 60, 
    alignItems: "center" 
  },
  timerText: { 
    color: "#7f91a4", 
    fontSize: 12, 
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" 
  },
});