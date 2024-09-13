import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Stack } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Tagesplaner',
          headerStyle: {
            backgroundColor: '#3848c2',

          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontSize: 40,
          },
        }}
      />
      <Stack.Screen
        name="todos"
        options={{
          title: 'Todos',
          headerStyle: {
            backgroundColor: '#3848c2',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontSize: 25,
          },
        }}
      />
      <Stack.Screen
        name="meetings"
        options={{
          title: 'Meetings',
          headerStyle: {
            backgroundColor: '#3848c2',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontSize: 25,
          },
        }}
      />
      <Stack.Screen
        name="meeting"
        options={{
          title: 'Meeting',
          headerStyle: {
            backgroundColor: '#3848c2',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontSize: 25,
          },
        }}
      />
      <Stack.Screen
        name="todo"
        options={{
          title: 'Todo',
          headerStyle: {
            backgroundColor: '#3848c2',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontSize: 25,
          },
        }}
      />
    </Stack>
  );
}

export default RootLayout;