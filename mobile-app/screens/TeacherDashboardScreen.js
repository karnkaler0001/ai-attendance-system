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
  ClipboardCheck,
  History,
  BarChart3,
  Bell,
  LogOut,
  GraduationCap,
  CalendarCheck,
} from "lucide-react-native";

const API_URL = "https://ai-attendance-system-vdbt.onrender.com";

export default function TeacherDashboardScreen({
  navigation,
  route,
}) {
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
      console.log("TEACHER ANALYTICS ERROR:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");

      navigation.replace("Login");
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
    }
  };

  const ToolCard = ({
    title,
    subtitle,
    icon,
    colors,
    onPress,
  }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.toolWrapper}
    >
      <LinearGradient
        colors={colors}
        style={styles.toolCard}
      >
        <View style={styles.toolIcon}>
          {icon}
        </View>

        <Text style={styles.toolTitle}>
          {title}
        </Text>

        <Text style={styles.toolSubtitle}>
          {subtitle}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

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
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <GraduationCap
              color="white"
              size={34}
            />
          </View>

          <Text style={styles.appName}>
            AttendAI
          </Text>

          <Text style={styles.title}>
            Hello, {user?.name || "Teacher"} 👋
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              Teacher Panel
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <LinearGradient
            colors={[
              "#2563eb",
              "#1d4ed8",
            ]}
            style={styles.summaryCard}
          >
            <CalendarCheck
              color="white"
              size={26}
            />

            <Text style={styles.summaryValue}>
              {analytics?.todayAttendance || 0}
            </Text>

            <Text style={styles.summaryLabel}>
              Present Today
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={[
              "#7c3aed",
              "#5b21b6",
            ]}
            style={styles.summaryCard}
          >
            <ClipboardCheck
              color="white"
              size={26}
            />

            <Text style={styles.summaryValue}>
              {analytics?.totalAttendance || 0}
            </Text>

            <Text style={styles.summaryLabel}>
              Total Records
            </Text>
          </LinearGradient>
        </View>

        <Text style={styles.sectionTitle}>
          Teacher Tools
        </Text>

        <View style={styles.toolsGrid}>
          <ToolCard
            title="Manual Attendance"
            subtitle="Mark a student present"
            colors={[
              "#16a34a",
              "#15803d",
            ]}
            icon={
              <ClipboardCheck
                color="white"
                size={28}
              />
            }
            onPress={() =>
              navigation.navigate(
                "ManualAttendance"
              )
            }
          />

          <ToolCard
            title="History"
            subtitle="View attendance logs"
            colors={[
              "#0891b2",
              "#0e7490",
            ]}
            icon={
              <History
                color="white"
                size={28}
              />
            }
            onPress={() =>
              navigation.navigate(
                "TeacherHistory"
              )
            }
          />

          <ToolCard
            title="Analytics"
            subtitle="Track attendance trends"
            colors={[
              "#f97316",
              "#ea580c",
            ]}
            icon={
              <BarChart3
                color="white"
                size={28}
              />
            }
            onPress={() =>
              navigation.navigate(
                "TeacherAnalytics"
              )
            }
          />

          <ToolCard
            title="Absent Students"
            subtitle="View today's absentees"
            colors={[
              "#dc2626",
              "#991b1b",
            ]}
            icon={
              <Bell
                color="white"
                size={28}
              />
            }
            onPress={() =>
              navigation.navigate(
                "TeacherAlerts"
              )
            }
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <LogOut color="white" size={22} />

          <Text style={styles.logoutText}>
            Logout
          </Text>
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
    marginBottom: 28,
  },

  headerIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor:
      "rgba(37,99,235,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  appName: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },

  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor:
      "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginTop: 14,
  },

  roleText: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  summaryCard: {
    width: "48%",
    borderRadius: 22,
    padding: 18,
    minHeight: 150,
    justifyContent: "space-between",
  },

  summaryValue: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
  },

  summaryLabel: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "white",
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 16,
  },

  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },

  toolWrapper: {
    width: "48%",
  },

  toolCard: {
    minHeight: 175,
    borderRadius: 22,
    padding: 16,
    justifyContent: "space-between",
  },

  toolIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor:
      "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  toolTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 18,
  },

  toolSubtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    marginTop: 6,
  },

  logoutButton: {
    backgroundColor:
      "rgba(220,38,38,0.9)",
    borderRadius: 18,
    padding: 16,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
});