import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function CT3Screen() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(300); 
  const [textColor, setTextColor] = useState("#00FFFF"); // Mặc định màu Cyan Neon

  const lastTap = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(1)).current; // Dùng cho hiệu ứng nhấp nháy Neon

  // Bảng màu Neon cực mạnh
  const neonColors = [
    { name: "Cyan", code: "#00FFFF" },
    { name: "Pink", code: "#FF00FF" },
    { name: "Lime", code: "#39FF14" },
    { name: "Yellow", code: "#FFF01F" },
    { name: "Red", code: "#FF3131" },
    { name: "Blue", code: "#1F51FF" }
  ];

  // Xử lý xoay màn hình
  useEffect(() => {
    async function toggleOrientation() {
      if (isRunning) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    }
    toggleOrientation();
    return () => ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, [isRunning]);

  // Logic Animation
  useEffect(() => {
    if (isRunning) {
      const displayWidth = Math.max(Dimensions.get("window").width, Dimensions.get("window").height);
      const distance = displayWidth * 3; 
      const duration = (distance / speed) * 1000;

      translateX.setValue(displayWidth);
      
      // Chạy chữ trôi
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -displayWidth * 2,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Nhấp nháy Neon (Glow)
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      translateX.stopAnimation();
      glowAnim.setValue(1);
    }
  }, [isRunning, speed]);

  const handleRun = () => {
    if (!text.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập chữ!");
      return;
    }
    setIsRunning(true);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) setIsRunning(false);
    else lastTap.current = now;
  };

  if (isRunning) {
    return (
      <Pressable style={styles.runningContainer} onPress={handleDoubleTap}>
        <StatusBar hidden={true} />
        <Animated.Text
          style={[
            styles.runningText,
            {
              transform: [{ translateX }],
              color: textColor,
              opacity: glowAnim, // Hiệu ứng nhấp nháy phát sáng
              // Shadow tạo hiệu ứng Neon (Chỉ hoạt động mạnh trên iOS, Android dùng elevation)
              textShadowColor: textColor,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
            },
          ]}
          numberOfLines={1}
        >
          {text}
        </Animated.Text>
        <Text style={styles.hintText}>(Nhấn đúp để thoát)</Text>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LED PRO</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Nội dung </Text>
          <TextInput
            style={styles.input}
            placeholder="NHẬP CHỮ Ở ĐÂY..."
            value={text}
            onChangeText={setText}
            placeholderTextColor="#C7C7CC"
          />

          <Text style={styles.sectionLabel}>Chọn màu</Text>
          <View style={styles.colorRow}>
            {neonColors.map((item) => (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.colorCircle, 
                  { backgroundColor: item.code, shadowColor: item.code, elevation: textColor === item.code ? 10 : 0 },
                  textColor === item.code && { borderWidth: 3, borderColor: '#000' }
                ]}
                onPress={() => setTextColor(item.code)}
              >
                {textColor === item.code && <Ionicons name="flash" size={18} color="white" />}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Tốc độ trôi</Text>
          <View style={styles.speedContainer}>
            {[150, 300, 600].map((v, i) => (
              <TouchableOpacity 
                key={v} 
                style={[styles.speedBtn, speed === v && { backgroundColor: textColor }]} 
                onPress={() => setSpeed(v)}
              >
                <Text style={[styles.speedBtnText, speed === v && { color: '#000' }]}>
                  {i === 0 ? "Chậm" : i === 1 ? "Vừa" : "Nhanh"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.runBtn, { backgroundColor: textColor, shadowColor: textColor }]} 
          onPress={handleRun}
        >
          <Text style={styles.runBtnText}>BẮT ĐẦU</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000", paddingTop: Platform.OS === "android" ? 35 : 0 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, backgroundColor: '#1A1A1A' },
  headerBtn: { width: 40 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  scrollContent: { padding: 20 },
  card: { backgroundColor: "#1A1A1A", borderRadius: 24, padding: 20, marginBottom: 25 },
  sectionLabel: { fontSize: 13, color: "#8E8E93", marginBottom: 15, marginTop: 15, fontWeight: "700" },
  input: { backgroundColor: "#333", borderRadius: 12, padding: 15, fontSize: 18, color: "#FFF", borderBottomWidth: 2, borderBottomColor: '#555' },
  colorRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  colorCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: "center", alignItems: "center", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10 },
  speedContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  speedBtn: { flex: 1, paddingVertical: 12, alignItems: "center", backgroundColor: "#333", marginHorizontal: 5, borderRadius: 12 },
  speedBtnText: { color: "#FFF", fontWeight: "bold" },
  runBtn: { padding: 20, borderRadius: 20, alignItems: "center", marginTop: 20, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },
  runBtnText: { color: "#000", fontSize: 20, fontWeight: "900" },
  runningContainer: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
  runningText: { fontSize: 180, fontWeight: "900", fontStyle: 'italic' },
  hintText: { color: "#333", position: "absolute", bottom: 20, alignSelf: "center" }
});
