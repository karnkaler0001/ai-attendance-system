import { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";

import { LinearGradient } from "expo-linear-gradient";

import {
  ScanFace,
  ShieldCheck,
} from "lucide-react-native";

const API_URL = "https://ai-attendance-system-vdbt.onrender.com";

export default function FaceLoginScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

  const cameraRef = useRef(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const markAttendance = async () => {
    try {
      setLoading(true);
      setMessage("");

      const photo =
        await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
          skipProcessing: true,
        });

      console.log(
        "LOGIN IMAGE SIZE:",
        photo.base64.length
      );

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

      console.log(data);

      if (data.success) {
        setMessage(
          `Welcome ${data.studentName}`
        );

        Alert.alert(
          "Attendance Marked",
          `Welcome ${data.studentName}`
        );
      } else {
        Alert.alert(
          "Failed",
          data.message
        );
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Attendance failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <LinearGradient
        colors={["#020617", "#0f172a"]}
        style={styles.center}
      >
        <Text style={styles.permissionText}>
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

      {/* TOP */}
      <LinearGradient
        colors={[
          "rgba(2,6,23,0.95)",
          "rgba(15,23,42,0.5)",
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

          <View>
            <Text style={styles.title}>
              AI Attendance
            </Text>

            <Text style={styles.subtitle}>
              Facial Recognition Verification
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* FACE GUIDE */}
      <View style={styles.faceGuide}>
        <View style={styles.faceCircle} />
      </View>

      {/* BOTTOM */}
      <LinearGradient
        colors={[
          "transparent",
          "rgba(2,6,23,0.98)",
        ]}
        style={styles.bottomOverlay}
      >
        {message ? (
          <Text style={styles.success}>
            {message}
          </Text>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={markAttendance}
          disabled={loading}
        >
          <LinearGradient
            colors={[
              "#16a34a",
              "#15803d",
            ]}
            style={styles.captureButton}
          >
            <ScanFace
              color="white"
              size={22}
            />

            <Text style={styles.buttonText}>
              {loading
                ? "Processing..."
                : "Mark Attendance"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingBottom: 40,
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

  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 4,
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
      "rgba(255,255,255,0.7)",
    borderRadius: 150,
    backgroundColor: "transparent",
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

  success: {
    color: "#00ff99",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});