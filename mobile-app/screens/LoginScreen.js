import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react-native";

const API_URL =
  "https://ai-attendance-system-vdbt.onrender.com";

export default function LoginScreen({
  navigation,
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const login = async () => {
    try {
      if (!email || !password) {
        Alert.alert(
          "Error",
          "Enter email and password"
        );

        return;
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!data.success) {
        Alert.alert(
          "Login Failed",
          data.message ||
            "Invalid email or password"
        );

        return;
      }

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigation.replace("Main", {
        user: data.user,
      });
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      Alert.alert(
        "Error",
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[
        "#020617",
        "#0f172a",
        "#1e293b",
      ]}
      style={styles.screen}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
        style={styles.container}
      >
        <View style={styles.logoBox}>
          <ShieldCheck
            color="white"
            size={46}
          />
        </View>

        <Text style={styles.title}>
          AttendAI
        </Text>

        <Text style={styles.subtitle}>
          Secure facial recognition
          attendance
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Welcome Back
          </Text>

          <View style={styles.inputBox}>
            <Mail
              color="#94a3b8"
              size={22}
            />

            <TextInput
              placeholder="Email address"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              selectionColor="#38bdf8"
            />
          </View>

          <View style={styles.inputBox}>
            <Lock
              color="#94a3b8"
              size={22}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              selectionColor="#38bdf8"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={login}
            disabled={loading}
          >
            <LinearGradient
              colors={
                loading
                  ? [
                      "#475569",
                      "#334155",
                    ]
                  : [
                      "#2563eb",
                      "#1d4ed8",
                    ]
              }
              style={styles.button}
            >
              {loading ? (
                <View
                  style={
                    styles.loadingRow
                  }
                >
                  <ActivityIndicator
                    color="white"
                    size="small"
                  />

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    Logging in...
                  </Text>
                </View>
              ) : (
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Login
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {loading && (
            <Text
              style={
                styles.loadingNote
              }
            >
              Please wait, the server may
              take a few seconds to wake
              up.
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor:
      "rgba(37,99,235,0.85)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },

  title: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },

  card: {
    backgroundColor:
      "rgba(255,255,255,0.08)",
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.12)",
  },

  cardTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "rgba(255,255,255,0.1)",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.1)",
  },

  input: {
    flex: 1,
    padding: 15,
    color: "white",
    fontSize: 16,
    backgroundColor:
      "transparent",
    outlineStyle: "none",
  },

  button: {
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  loadingNote: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
  },
});