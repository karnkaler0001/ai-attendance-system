import { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { LineChart } from "react-native-chart-kit";

import {
  Users,
  ClipboardCheck,
  CalendarCheck,
  Activity,
} from "lucide-react-native";

const API_URL = "https://ai-attendance-system-vdbt.onrender.com";

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState(null);

  const screenWidth = Dimensions.get("window").width;

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

  const StatCard = ({ title, value, icon, colors }) => (
    <LinearGradient colors={colors} style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle}>{title}</Text>

        <View style={styles.iconBox}>{icon}</View>
      </View>

      <Text style={styles.cardValue}>{value}</Text>
    </LinearGradient>
  );

  return (
    <LinearGradient
      colors={["#020617", "#0f172a", "#1e293b"]}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics Dashboard</Text>

          <Text style={styles.subtitle}>
            AI attendance insights & trends
          </Text>
        </View>

        <StatCard
          title="Total Attendance"
          value={analytics?.totalAttendance || 0}
          icon={<ClipboardCheck color="white" size={24} />}
          colors={["#2563eb", "#1d4ed8"]}
        />

        <StatCard
          title="Total Students"
          value={analytics?.totalStudents || 0}
          icon={<Users color="white" size={24} />}
          colors={["#7c3aed", "#5b21b6"]}
        />

        <StatCard
          title="Today's Attendance"
          value={analytics?.todayAttendance || 0}
          icon={<CalendarCheck color="white" size={24} />}
          colors={["#16a34a", "#15803d"]}
        />

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Weekly Attendance Trend
          </Text>

          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
              datasets: [
                {
                  data: [
                    12,
                    19,
                    15,
                    22,
                    analytics?.todayAttendance || 0,
                  ],
                },
              ],
            }}
            width={screenWidth - 40}
            height={240}
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: "#1e293b",
              backgroundGradientTo: "#0f172a",
              decimalPlaces: 0,
              color: (opacity = 1) =>
                `rgba(56,189,248,${opacity})`,
              labelColor: (opacity = 1) =>
                `rgba(255,255,255,${opacity})`,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#38bdf8",
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Activity color="#38bdf8" size={24} />

            <Text style={styles.recentTitle}>
              Recent Activity
            </Text>
          </View>

          {analytics?.recentAttendance?.length > 0 ? (
            analytics.recentAttendance.map((item, index) => (
              <View key={index} style={styles.recentCard}>
                <Text style={styles.student}>
                  {item.studentName || "Unknown Student"}
                </Text>

                <Text style={styles.meta}>
                  ID: {item.studentId || "N/A"}
                </Text>

                <View style={styles.row}>
                  <Text style={styles.date}>{item.date}</Text>

                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No recent attendance records
            </Text>
          )}
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 25,
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 8,
    fontSize: 16,
  },

  card: {
    borderRadius: 26,
    padding: 22,
    marginBottom: 18,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 18,
    fontWeight: "600",
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardValue: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    marginTop: 20,
  },

  chartContainer: {
    marginTop: 20,
    marginBottom: 25,
  },

  chartTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  chart: {
    borderRadius: 24,
  },

  recentSection: {
    marginTop: 15,
  },

  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },

  recentTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },

  recentCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  student: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  meta: {
    color: "#cbd5e1",
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  date: {
    color: "#38bdf8",
    fontWeight: "600",
  },

  time: {
    color: "#22c55e",
    fontWeight: "600",
  },

  emptyText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});