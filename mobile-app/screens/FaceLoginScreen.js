import { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { CameraView, useCameraPermissions } from "expo-camera";

import { LinearGradient } from "expo-linear-gradient";

import {
  ScanFace,
  ShieldCheck,
  LogOut,
  CircleCheck,
} from "lucide-react-native";

const API_URL =
  "https://ai-attendance-system-vdbt.onrender.com";

export default function FaceLoginScreen({
  navigation,
}) {
  const [permission, requestPermission] =
    useCameraPermissions();

  const cameraRef = useRef(null);

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");

      navigation.replace("Login");
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
    }
  };

  const markAttendance = async () => {
    try {
      if (!cameraRef.current) {
        Alert.alert(
          "Error",
          "Camera is not ready yet"
        );

        return;
      }

      setLoading(true);
      setSuccessMessage("");

      const photo =
        await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
          skipProcessing: true,
        });

      const response = await fetch(
        `${API_URL}/attendance/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            image: photo.base64,
          }),
        }
      );

      const data =
        await response.json();

      if (data.success) {
        const studentName =
          data.studentName ||
          data.name ||
          "Student";

        setSuccessMessage(
          `Attendance marked successfully for ${studentName}`
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } else {
        Alert.alert(
          "Face Not Recognized",
          data.message ||
            "Please try again"
        );
      }
    } catch (error) {
      console.log(
        "ATTENDANCE ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to mark attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <LinearGradient
        colors={[
          "#020617",
          "#0f172a",
          "#1e293b",
        ]}
        style={styles.center}
      >
        <Text
          style={styles.permissionText}
        >
          Camera permission required
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>
            Allow Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.permissionLogout}
          onPress={logout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
      />

      <LinearGradient
        colors={[
          "rgba(2,6,23,0.98)",
          "rgba(15,23,42,0.55)",
          "transparent",
        ]}
        style={styles.topOverlay}
      >
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <ShieldCheck
              color="white"
              size={30}
            />
          </View>

          <View style={styles.headerTextBox}>
            <Text style={styles.title}>
              AttendAI
            </Text>

            <Text style={styles.subtitle}>
              Facial Recognition Verification
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <LogOut
            color="white"
            size={20}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.faceGuide}>
        <View style={styles.faceCircle} />
      </View>

      {successMessage ? (
        <View style={styles.successCard}>
          <CircleCheck
            color="#22c55e"
            size={42}
          />

          <Text style={styles.successTitle}>
            Attendance Marked
          </Text>

          <Text style={styles.successText}>
            {successMessage}
          </Text>
        </View>
      ) : null}

      <LinearGradient
        colors={[
          "transparent",
          "rgba(2,6,23,0.98)",
        ]}
        style={styles.bottomOverlay}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={markAttendance}
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
                    "#16a34a",
                    "#15803d",
                  ]
            }
            style={styles.captureButton}
          >
            {loading ? (
              <ActivityIndicator
                color="white"
                size="small"
              />
            ) : (
              <ScanFace
                color="white"
                size={22}
              />
            )}

            <Text style={styles.buttonText}>
              {loading
                ? "Processing Face..."
                : "Mark Attendance"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {loading ? (
          <Text style={styles.loadingNote}>
            Keep your face inside the frame.
          </Text>
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  camera: {
    flex: 1,
  },

  topOverlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 42,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor:
      "rgba(22,163,74,0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  headerTextBox: {
    flex: 1,
  },

  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 4,
  },

  logoutButton: {
    marginTop: 18,
    backgroundColor:
      "rgba(220,38,38,0.9)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
  },

  faceGuide: {
    position: "absolute",
    top: "28%",
    width: "100%",
    alignItems: "center",
  },

  faceCircle: {
    width: 250,
    height: 320,
    borderWidth: 4,
    borderColor:
      "rgba(255,255,255,0.75)",
    borderRadius: 150,
    backgroundColor:
      "transparent",
  },

  successCard: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    width: "86%",
    backgroundColor:
      "rgba(15,23,42,0.96)",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      "rgba(34,197,94,0.65)",
  },

  successTitle: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  successText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },

  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    paddingBottom: 45,
    alignItems: "center",
  },

  captureButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 17,
    paddingHorizontal: 34,
    borderRadius: 999,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  loadingNote: {
    color: "#cbd5e1",
    marginTop: 14,
    fontSize: 14,
    textAlign: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  permissionText: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
  },

  permissionButton: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 14,
  },

  permissionLogout: {
    marginTop: 18,
    backgroundColor:
      "rgba(220,38,38,0.9)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
});