import { useEffect, useState } from "react";

import {
  View,
 Text,
  FlatList,
  StyleSheet,
} from "react-native";

const API_URL =
  "https://ai-attendance-system-vdbt.onrender.com/";

export default function NotificationScreen() {
  const [absentStudents, setAbsentStudents] =
    useState([]);

  const [totalAbsent, setTotalAbsent] =
    useState(0);

  useEffect(() => {
    fetchAbsentStudents();
  }, []);

  const fetchAbsentStudents = async () => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/absent`
      );

      const data =
        await response.json();

      if (data.success) {
        setAbsentStudents(
          data.absentStudents
        );

        setTotalAbsent(
          data.totalAbsent
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Absent Students
      </Text>

      <Text style={styles.total}>
        Total Absent: {totalAbsent}
      </Text>

      <FlatList
        data={absentStudents}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.text}>
              Roll No: {item.rollNo}
            </Text>

            <Text style={styles.text}>
              {item.email}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No absent students today
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 20,
  },

  total: {
    color: "#ff5555",
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  name: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  text: {
    color: "#ccc",
    marginTop: 5,
  },

  empty: {
    color: "white",
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
  },
});