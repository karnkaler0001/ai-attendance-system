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
  Hash,
  Lock,
  UserPlus,
} from "lucide-react-native";

import axios from "axios";

const API_URL = "https://ai-attendance-system-vdbt.onrender.com";

export default function RegisterStudentScreen() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const registerStudent = async () => {
    try {
      if (!name || !rollNo || !email || !password) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      setLoading(true);
      setSuccessMessage("");

      const response = await axios.post(
        `${API_URL}/students/register`,
        {
          name,
          rollNo,
          email,
          password,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Student Account Created ✔");

        setName("");
        setRollNo("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Registration failed"
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Student Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <UserPlus color="white" size={42} />
          </View>

          <Text style={styles.title}>Register Student</Text>

          <Text style={styles.subtitle}>
            Create student profile & login account
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputBox}>
            <User color="#94a3b8" size={22} />

            <TextInput
              placeholder="Student Name"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={name}
              onChangeText={setName}
              editable={!loading}
              selectionColor="#38bdf8"
            />
          </View>

          <View style={styles.inputBox}>
            <Hash color="#94a3b8" size={22} />

            <TextInput
              placeholder="Roll Number / Student ID"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={rollNo}
              onChangeText={setRollNo}
              editable={!loading}
              selectionColor="#38bdf8"
            />
          </View>

          <View style={styles.inputBox}>
            <Mail color="#94a3b8" size={22} />

            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              editable={!loading}
              selectionColor="#38bdf8"
            />
          </View>

          <View style={styles.inputBox}>
            <Lock color="#94a3b8" size={22} />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              selectionColor="#38bdf8"
            />
          </View>

          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={registerStudent}
            disabled={loading}
          >
            <LinearGradient
              colors={
                loading
                  ? ["#475569", "#334155"]
                  : ["#2563eb", "#1d4ed8"]
              }
              style={styles.button}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.buttonText}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>
                  Create Student Account
                </Text>
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
    backgroundColor: "rgba(37,99,235,0.9)",
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
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 22,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  input: {
    flex: 1,
    padding: 16,
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    outlineStyle: "none",
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
});