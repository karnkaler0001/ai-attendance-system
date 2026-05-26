import { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { ScanFace, User, Hash } from "lucide-react-native";

const API_URL = "https://ai-attendance-system-vdbt.onrender.com";

export default function FaceRegisterScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [photoTaken, setPhotoTaken] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const takePicture = async () => {
    try {
      if (!studentName || !studentId) {
        Alert.alert("Error", "Enter student name and ID");
        return;
      }

      setLoading(true);

      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
        skipProcessing: true,
      });

      const response = await fetch(`${API_URL}/face/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: photo.base64,
          name: studentName,
          studentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPhotoTaken(true);
        Alert.alert("Success", "Face registered successfully");
        setStudentName("");
        setStudentId("");
      } else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to register face");
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <LinearGradient colors={["#020617", "#0f172a"]} style={styles.center}>
        <Text style={styles.permissionText}>Camera permission required</Text>

        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="front" />

      <LinearGradient
        colors={["rgba(2,6,23,0.95)", "rgba(15,23,42,0.6)", "transparent"]}
        style={styles.topOverlay}
      >
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <ScanFace color="white" size={30} />
          </View>

          <View>
            <Text style={styles.title}>Register Face</Text>
            <Text style={styles.subtitle}>Capture student face securely</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputBox}>
            <User color="#94a3b8" size={20} />

            <TextInput
              placeholder="Student Name"
              placeholderTextColor="#94a3b8"
              value={studentName}
              onChangeText={setStudentName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputBox}>
            <Hash color="#94a3b8" size={20} />

            <TextInput
              placeholder="Student ID"
              placeholderTextColor="#94a3b8"
              value={studentId}
              onChangeText={setStudentId}
              style={styles.input}
            />
          </View>
        </View>
      </LinearGradient>

      <LinearGradient
        colors={["transparent", "rgba(2,6,23,0.95)"]}
        style={styles.bottomOverlay}
      >
        {photoTaken && <Text style={styles.success}>Face Registered ✔</Text>}

        <TouchableOpacity activeOpacity={0.85} onPress={takePicture} disabled={loading}>
          <LinearGradient
            colors={["#7c3aed", "#5b21b6"]}
            style={styles.captureButton}
          >
            <ScanFace color="white" size={22} />
            <Text style={styles.buttonText}>
              {loading ? "Processing..." : "Capture Face"}
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
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(124,58,237,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 4,
  },

  form: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.85)",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    color: "white",
    padding: 14,
    fontSize: 16,
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
    backgroundColor: "#7c3aed",
    padding: 15,
    borderRadius: 14,
  },
});