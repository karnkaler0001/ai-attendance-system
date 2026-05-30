import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  User,
  Mail,
  Lock,
  UserPlus,
  GraduationCap,
} from "lucide-react-native";

const API_URL =
  "https://ai-attendance-system-vdbt.onrender.com";

export default function RegisterTeacherScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const validateEmail = (value) => {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(value);
  };

  const validatePassword = (value) => {
    return (
      value.length >= 7 &&
      /[A-Za-z]/.test(value) &&
      /\d/.test(value)
    );
  };

  const registerTeacher = async () => {
    try {
      const cleanName = name.trim();
      const cleanEmail =
        email.trim().toLowerCase();

      if (
        !cleanName ||
        !cleanEmail ||
        !password
      ) {
        Alert.alert(
          "Missing Details",
          "Please fill all fields."
        );

        return;
      }

      if (!validateEmail(cleanEmail)) {
        Alert.alert(
          "Invalid Email",
          "Please enter a valid email address."
        );

        return;
      }

      if (!validatePassword(password)) {
        Alert.alert(
          "Weak Password",
          "Password must contain at least 7 characters, including one alphabet and one number."
        );

        return;
      }

      setLoading(true);
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password,
            role: "teacher",
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        Alert.alert(
          "Registration Failed",
          data.message ||
            "Unable to create teacher account."
        );

        return;
      }

      setSuccessMessage(
        "Teacher Account Created Successfully ✔"
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3500);
    } catch (error) {
      console.log(
        "TEACHER REGISTER ERROR:",
        error
      );

      Alert.alert(
        "Registration Failed",
        "Unable to create teacher account."
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
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <GraduationCap
              color="white"
              size={44}
            />
          </View>

          <Text style={styles.title}>
            Register Teacher
          </Text>

          <Text style={styles.subtitle}>
            Create a teacher login account
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputBox}>
            <User
              color="#94a3b8"
              size={22}
            />

            <TextInput
              placeholder="Teacher Name"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={!loading}
              selectionColor="#38bdf8"
            />
          </View>

          <View style={styles.inputBox}>
            <Mail
              color="#94a3b8"
              size={22}
            />

            <TextInput
              placeholder="Teacher Email Address"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
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

          <Text style={styles.passwordHint}>
            Password must contain at least
            7 characters, including one
            alphabet and one number.
          </Text>

          {successMessage ? (
            <Text style={styles.successText}>
              {successMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={registerTeacher}
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
                      "#7c3aed",
                      "#5b21b6",
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
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <View
                  style={
                    styles.loadingRow
                  }
                >
                  <UserPlus
                    color="white"
                    size={21}
                  />

                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    Create Teacher Account
                  </Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor:
      "rgba(124,58,237,0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },

  card: {
    backgroundColor:
      "rgba(255,255,255,0.08)",
    padding: 22,
    borderRadius: 26,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.1)",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "rgba(255,255,255,0.08)",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
  },

  input: {
    flex: 1,
    padding: 16,
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    outlineStyle: "none",
  },

  passwordHint: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },

  successText: {
    color: "#00ff99",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  button: {
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 6,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});