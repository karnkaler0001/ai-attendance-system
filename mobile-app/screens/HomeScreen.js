import { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";

import {
  Users,
  ClipboardCheck,
  CalendarCheck,
  Bell,
  UserPlus,
  ScanFace,
  LogOut,
} from "lucide-react-native";

const API_URL = "https://ai-attendance-system-vdbt.onrender.com";

export default function HomeScreen({ navigation, route }) {
  const user = route.params?.user;

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/analytics`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      navigation.replace("Login");
    } catch (error) {
      console.log(error);
    }
  };

  const StatCard = ({ title, value, icon, colors }) => (
    <LinearGradient colors={colors} style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </LinearGradient>
  );

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appName}>AttendAI</Text>

          <Text style={styles.title}>
            Hello, {user?.name || "User"} 👋
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role || "guest"}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Students"
            value={analytics?.totalStudents || 0}
            icon={<Users color="white" size={24} />}
            colors={["#2563eb", "#1d4ed8"]}
          />

          <StatCard
            title="Total Attendance"
            value={analytics?.totalAttendance || 0}
            icon={<ClipboardCheck color="white" size={24} />}
            colors={["#7c3aed", "#5b21b6"]}
          />

          <StatCard
            title="Today"
            value={analytics?.todayAttendance || 0}
            icon={<CalendarCheck color="white" size={24} />}
            colors={["#16a34a", "#15803d"]}
          />

          <StatCard
            title="Alerts"
            value="View"
            icon={<Bell color="white" size={24} />}
            colors={["#dc2626", "#991b1b"]}
          />
        </View>

        {user?.role === "admin" && (
          <View style={styles.adminBox}>
            <Text style={styles.sectionTitle}>Admin Shortcuts</Text>

            <View style={styles.shortcutGrid}>
              <TouchableOpacity
                style={styles.shortcut}
                onPress={() => navigation.navigate("RegisterStudent")}
              >
                <UserPlus color="#38bdf8" size={30} />
                <Text style={styles.shortcutText}>Add Student</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shortcut}
                onPress={() => navigation.navigate("FaceRegister")}
              >
                <ScanFace color="#a78bfa" size={30} />
                <Text style={styles.shortcutText}>Register Face</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shortcut}
                onPress={() => navigation.navigate("ManualAttendance")}
              >
                <ClipboardCheck color="#22c55e" size={30} />
                <Text style={styles.shortcutText}>Manual Attendance</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {user?.role === "teacher" && (
          <View style={styles.adminBox}>
            <Text style={styles.sectionTitle}>Teacher Tools</Text>

            <View style={styles.shortcutGrid}>
              <TouchableOpacity
                style={styles.shortcut}
                onPress={() => navigation.navigate("ManualAttendance")}
              >
                <ClipboardCheck color="#22c55e" size={30} />
                <Text style={styles.shortcutText}>Manual Attendance</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.recentBox}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {analytics?.recentAttendance?.length > 0 ? (
            analytics.recentAttendance.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.activityCard}>
                <View>
                  <Text style={styles.activityName}>
                    {item.studentName || "Unknown Student"}
                  </Text>

                  <Text style={styles.activityMeta}>
                    ID: {item.studentId || "N/A"}
                  </Text>
                </View>

                <View>
                  <Text style={styles.activityDate}>{item.date}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent activity yet</Text>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut color="white" size={22} />

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },

  header: {
    marginBottom: 26,
  },

  appName: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },

  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.12)",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginTop: 14,
  },

  roleText: {
    color: "#e2e8f0",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  statCard: {
    width: "48%",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    minHeight: 150,
    justifyContent: "space-between",
  },

  statIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  statValue: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },

  statTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontWeight: "600",
  },

  adminBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },

  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },

  shortcut: {
    width: "48%",
    minHeight: 135,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  shortcutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 19,
  },

  recentBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  activityCard: {
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityName: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  activityMeta: {
    color: "#94a3b8",
    marginTop: 4,
  },

  activityDate: {
    color: "#38bdf8",
    fontWeight: "bold",
    textAlign: "right",
  },

  activityTime: {
    color: "#22c55e",
    marginTop: 4,
    textAlign: "right",
  },

  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 10,
  },

  logoutButton: {
    backgroundColor: "rgba(220,38,38,0.9)",
    borderRadius: 18,
    padding: 16,
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  logoutText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});