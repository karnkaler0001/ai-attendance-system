import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { ClipboardCheck, Hash } from "lucide-react-native";

const API_URL = "https://ai-attendance-system-vdbt.onrender.com";

export default function ManualAttendanceScreen() {
  const [studentId, setStudentId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const markAttendance = async () => {
    try {
      if (!studentId) {
        Alert.alert("Error", "Enter student ID");
        return;
      }

      const response = await fetch(
        `${API_URL}/manual-attendance/mark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Attendance marked successfully ✔");
        setStudentId("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to mark attendance");
    }
  };

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.iconBox}>
          <ClipboardCheck color="white" size={42} />
        </View>

        <Text style={styles.title}>Manual Attendance</Text>

        <Text style={styles.subtitle}>
          Enter student ID to mark attendance
        </Text>

        <View style={styles.card}>
          <View style={styles.inputBox}>
            <Hash color="#94a3b8" size={22} />

            <TextInput
              placeholder="Student ID / Roll Number"
              placeholderTextColor="#94a3b8"
              value={studentId}
              onChangeText={setStudentId}
              style={styles.input}
            />
          </View>

          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          <TouchableOpacity activeOpacity={0.85} onPress={markAttendance}>
            <LinearGradient
              colors={["#16a34a", "#15803d"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Mark Attendance</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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

  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: "rgba(22,163,74,0.9)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
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
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});