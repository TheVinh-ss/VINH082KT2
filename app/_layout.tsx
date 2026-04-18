import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Trang chủ" }} />
      <Stack.Screen name="CT1" options={{ headerShown: false }} />
      <Stack.Screen name="CT2" options={{ headerShown: false }} />
      <Stack.Screen name="CT3" options={{ headerShown: false }} />
      <Stack.Screen name="Thongtin" options={{ headerShown: false }} />
    </Stack>
  );
}