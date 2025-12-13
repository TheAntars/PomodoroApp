import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TimerProvider } from "./src/context/TimerContext";
import { View, Platform, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import { RootStackParamList } from "./src/navigation/AppNavigator";

// Ekranlar
import HomeScreen from "./src/screens/HomeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import StatsScreen from "./src/screens/StatsScreen";

// Bildirim Ayarı: Uygulama açıkken de bildirim gelsin
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const isWeb = Platform.OS === "web";

  // İzinleri İste
  useEffect(() => {
    (async () => {
      if (!isWeb) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          await Notifications.requestPermissionsAsync();
        }
      }
    })();
  }, []);

  return (
    <TimerProvider>
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: isWeb ? "#121212" : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={
              {
                width: isWeb ? 375 : "100%",
                height: isWeb ? 812 : "100%",
                maxHeight: isWeb ? 730 : "100%",
                overflow: "hidden",
                borderRadius: isWeb ? 30 : 0,
                boxShadow: isWeb ? "0px 0px 50px rgba(0,0,0,0.5)" : undefined,
                elevation: isWeb ? 10 : 0,
                backgroundColor: "#000",
              } as any
            }
          >
            <NavigationContainer>
              <StatusBar barStyle="light-content" backgroundColor="#000" />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Stats" component={StatsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </View>
      </SafeAreaProvider>
    </TimerProvider>
  );
}
