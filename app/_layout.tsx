import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(auth)',
};

function AppShell() {
  const { isAuthenticated, isReady } = useAuth();
  const colorScheme = useColorScheme();

  const navigationTheme: Theme =
    colorScheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: Colors.dark.tint,
            background: Colors.dark.background,
            card: Colors.dark.surface,
            text: Colors.dark.text,
            border: Colors.dark.border,
            notification: Colors.dark.accent,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: Colors.light.tint,
            background: Colors.light.background,
            card: Colors.light.surface,
            text: Colors.light.text,
            border: Colors.light.border,
            notification: Colors.light.accent,
          },
        };

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: navigationTheme.colors.background }}>
        <ActivityIndicator size="large" color={navigationTheme.colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name={isAuthenticated ? '(tabs)' : '(auth)'} options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
