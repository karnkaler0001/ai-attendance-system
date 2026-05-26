import { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Home,
  ClipboardCheck,
  BarChart3,
  Bell,
  User,
} from "lucide-react-native";

import {
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import RegisterStudentScreen from "./screens/RegisterStudentScreen";
import FaceRegisterScreen from "./screens/FaceRegisterScreen";
import FaceLoginScreen from "./screens/FaceLoginScreen";
import AttendanceHistoryScreen from "./screens/AttendanceHistoryScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import NotificationScreen from "./screens/NotificationScreen";
import ManualAttendanceScreen from "./screens/ManualAttendanceScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  const user = route.params?.user;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#020617",
          borderTopColor: "rgba(255,255,255,0.1)",
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#38bdf8",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        initialParams={{ user }}
        options={{
          tabBarIcon: ({ color }) => (
            <Home color={color} size={24} />
          ),
        }}
      />

      {(user?.role === "teacher" ||
        user?.role === "student") && (
        <Tab.Screen
          name="Mark"
          component={FaceLoginScreen}
          initialParams={{ user }}
          options={{
            tabBarLabel: "Attendance",
            tabBarIcon: ({ color }) => (
              <ClipboardCheck
                color={color}
                size={24}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="History"
        component={AttendanceHistoryScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel:
            user?.role === "student"
              ? "My History"
              : "History",
          tabBarIcon: ({ color }) => (
            <User color={color} size={24} />
          ),
        }}
      />

      {(user?.role === "admin" ||
        user?.role === "teacher") && (
        <Tab.Screen
          name="Analytics"
          component={AnalyticsScreen}
          initialParams={{ user }}
          options={{
            tabBarIcon: ({ color }) => (
              <BarChart3 color={color} size={24} />
            ),
          }}
        />
      )}

      {(user?.role === "admin" ||
        user?.role === "teacher") && (
        <Tab.Screen
          name="Alerts"
          component={NotificationScreen}
          initialParams={{ user }}
          options={{
            tabBarLabel: "Absents",
            tabBarIcon: ({ color }) => (
              <Bell color={color} size={24} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] =
    useState("Login");

  const [savedUser, setSavedUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const userData =
        await AsyncStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);
        setSavedUser(user);

        if (user.role === "student") {
          setInitialRoute("FaceLogin");
        } else {
          setInitialRoute("Main");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          color="#38bdf8"
          size="large"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Main"
          component={MainTabs}
          initialParams={{
            user: savedUser,
          }}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="RegisterStudent"
          component={RegisterStudentScreen}
          options={{
            title: "Register Student",
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
          name="FaceLogin"
          component={FaceLoginScreen}
          initialParams={{
            user: savedUser,
          }}
          options={{
            title: "Mark Attendance",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ManualAttendance"
          component={ManualAttendanceScreen}
          options={{
            title: "Manual Attendance",
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