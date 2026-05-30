import { useEffect, useState } from "react";

import {
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  Home,
  ClipboardCheck,
  BarChart3,
  Bell,
  User,
} from "lucide-react-native";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import TeacherDashboardScreen from "./screens/TeacherDashboardScreen";
import RegisterStudentScreen from "./screens/RegisterStudentScreen";
import FaceRegisterScreen from "./screens/FaceRegisterScreen";
import FaceLoginScreen from "./screens/FaceLoginScreen";
import AttendanceHistoryScreen from "./screens/AttendanceHistoryScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import NotificationScreen from "./screens/NotificationScreen";
import ManualAttendanceScreen from "./screens/ManualAttendanceScreen";
import RegisterTeacherScreen from "./screens/RegisterTeacherScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs({ route }) {
  const user = route.params?.user;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#020617",
          borderTopColor:
            "rgba(255,255,255,0.1)",
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor:
          "#38bdf8",
        tabBarInactiveTintColor:
          "#64748b",
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={HomeScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Home color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminHistory"
        component={AttendanceHistoryScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color }) => (
            <User color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminAnalytics"
        component={AnalyticsScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color }) => (
            <BarChart3
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AdminAlerts"
        component={NotificationScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Absents",
          tabBarIcon: ({ color }) => (
            <Bell color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TeacherTabs({ route }) {
  const user = route.params?.user;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#020617",
          borderTopColor:
            "rgba(255,255,255,0.1)",
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor:
          "#38bdf8",
        tabBarInactiveTintColor:
          "#64748b",
      }}
    >
      <Tab.Screen
        name="TeacherDashboard"
        component={TeacherDashboardScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Home color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="TeacherMark"
        component={ManualAttendanceScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Mark",
          tabBarIcon: ({ color }) => (
            <ClipboardCheck
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tab.Screen
        name="TeacherHistory"
        component={AttendanceHistoryScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color }) => (
            <User color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="TeacherAnalytics"
        component={AnalyticsScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color }) => (
            <BarChart3
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tab.Screen
        name="TeacherAlerts"
        component={NotificationScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Absents",
          tabBarIcon: ({ color }) => (
            <Bell color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function StudentTabs({ route }) {
  const user = route.params?.user;

  return (
    <Tab.Navigator
      initialRouteName="StudentMark"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#020617",
          borderTopColor:
            "rgba(255,255,255,0.1)",
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor:
          "#38bdf8",
        tabBarInactiveTintColor:
          "#64748b",
      }}
    >
      <Tab.Screen
        name="StudentMark"
        component={FaceLoginScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Scan Face",
          tabBarIcon: ({ color }) => (
            <ClipboardCheck
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tab.Screen
        name="StudentHistory"
        component={AttendanceHistoryScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "My History",
          tabBarIcon: ({ color }) => (
            <User color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RoleBasedApp({ route }) {
  const user = route.params?.user;

  if (user?.role === "admin") {
    return <AdminTabs route={{ params: { user } }} />;
  }

  if (user?.role === "teacher") {
    return <TeacherTabs route={{ params: { user } }} />;
  }

  return <StudentTabs route={{ params: { user } }} />;
}

export default function App() {
  const [savedUser, setSavedUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    checkSavedLogin();
  }, []);

  const checkSavedLogin = async () => {
    try {
      const saved =
        await AsyncStorage.getItem("user");

      if (saved) {
        setSavedUser(JSON.parse(saved));
      }
    } catch (error) {
      console.log(
        "AUTO LOGIN ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#38bdf8"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={
          savedUser ? "Main" : "Login"
        }
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Main"
          component={RoleBasedApp}
          initialParams={{
            user: savedUser,
          }}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="RegisterStudent"
          component={RegisterStudentScreen}
          options={{
            title: "Register Student",
          }}
        />

        <Stack.Screen
  name="RegisterTeacher"
  component={RegisterTeacherScreen}
  options={{
    title: "Register Teacher",
  }}
/>

        <Stack.Screen
          name="FaceRegister"
          component={FaceRegisterScreen}
          options={{
            title: "Register Face",
          }}
        />

        <Stack.Screen
          name="ManualAttendance"
          component={ManualAttendanceScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },
});