import { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  CalendarDays,
  Clock,
  UserCheck,
  RefreshCw,
} from "lucide-react-native";

const API_URL =
  "https://ai-attendance-system-vdbt.onrender.com";

export default function AttendanceHistoryScreen({
  route,
}) {
  const user = route.params?.user;

  const [records, setRecords] = useState([]);
  const [refreshing, setRefreshing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const url =
        user?.role === "student" &&
        user?.studentId
          ? `${API_URL}/history/student/${user.studentId}`
          : `${API_URL}/history`;

      const response = await fetch(url);

      const data = await response.json();

      if (data.success) {
        setRecords(data.records);
      }
    } catch (error) {
      console.log(
        "HISTORY FETCH ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshHistory = async () => {
    try {
      setRefreshing(true);

      await fetchHistory();
    } finally {
      setRefreshing(false);
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
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}>
              <UserCheck
                color="white"
                size={30}
              />
            </View>

            <View style={styles.headerText}>
              <Text style={styles.title}>
                {user?.role === "student"
                  ? "My Attendance"
                  : "Attendance History"}
              </Text>

              <Text style={styles.subtitle}>
                Recent attendance activity
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refreshHistory}
            disabled={refreshing}
            activeOpacity={0.8}
          >
            {refreshing ? (
              <ActivityIndicator
                color="white"
                size="small"
              />
            ) : (
              <RefreshCw
                color="white"
                size={21}
              />
            )}
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator
              size="large"
              color="#38bdf8"
            />

            <Text style={styles.loaderText}>
              Loading attendance history...
            </Text>
          </View>
        ) : (
          <FlatList
            data={records}
            keyExtractor={(item) =>
              item._id
            }
            showsVerticalScrollIndicator={
              false
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshHistory}
                tintColor="#38bdf8"
              />
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.name}>
                  {item.studentName ||
                    "Unknown Student"}
                </Text>

                <Text style={styles.idText}>
                  ID: {item.studentId}
                </Text>

                <View style={styles.row}>
                  <View
                    style={
                      styles.metaItem
                    }
                  >
                    <CalendarDays
                      color="#38bdf8"
                      size={18}
                    />

                    <Text
                      style={
                        styles.metaText
                      }
                    >
                      {item.date}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.metaItem
                    }
                  >
                    <Clock
                      color="#22c55e"
                      size={18}
                    />

                    <Text
                      style={
                        styles.metaText
                      }
                    >
                      {item.time}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View
                style={styles.emptyBox}
              >
                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No Records Found
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Mark attendance and press
                  refresh to see records here.
                </Text>
              </View>
            }
          />
        )}
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
    padding: 20,
    paddingTop: 60,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  headerText: {
    flex: 1,
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor:
      "rgba(14,165,233,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  refreshButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor:
      "rgba(37,99,235,0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  title: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 14,
  },

  card: {
    backgroundColor:
      "rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.1)",
  },

  name: {
    color: "white",
    fontSize: 21,
    fontWeight: "bold",
  },

  idText: {
    color: "#cbd5e1",
    marginTop: 6,
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent:
      "space-between",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  metaText: {
    color: "#e2e8f0",
    fontSize: 14,
  },

  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loaderText: {
    color: "#94a3b8",
    marginTop: 14,
  },

  emptyBox: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  emptyText: {
    color: "#94a3b8",
    marginTop: 8,
    textAlign: "center",
  },
});