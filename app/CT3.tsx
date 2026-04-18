import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
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

  // State quản lý chiều rộng màn hình (cập nhật khi xoay)
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

  const [text, setText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(4000);
  const [textColor, setTextColor] = useState("#FFCC00");

  const lastTap = useRef(0);
  const translateX = useRef(new Animated.Value(Dimensions.get("window").width)).current;

  // Lắng nghe sự kiện đổi kích thước khi người dùng tự xoay điện thoại
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // ==========================================
  // XỬ LÝ XOAY MÀN HÌNH THEO Ý MUỐN
  // ==========================================
  useEffect(() => {
    if (isRunning) {
      ScreenOrientation.unlockAsync();
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [isRunning]);

  const speedOptions = [
    { label: "Chậm", value: 8000 },
    { label: "Vừa", value: 4000 },
    { label: "Nhanh", value: 2000 },
  ];
  const colorOptions = ["#FFCC00", "#FF3B30", "#34C759", "#007AFF", "#A2845E", "#FFFFFF"];

  const handleRun = () => {
    if (!text.trim()) return;
    setIsRunning(true);
  };

  useEffect(() => {
    if (isRunning) {
      translateX.setValue(screenWidth);
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -screenWidth * 2,
          duration: speed,
          useNativeDriver: true,
        })
      ).start();
    } else {
      translateX.stopAnimation();
    }
  }, [isRunning, speed, screenWidth]);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setIsRunning(false);
    } else {
      lastTap.current = now;
    }
  };

  // ==========================================
  // GIAO DIỆN 2: CHỮ ĐANG CHẠY (MÀN HÌNH ĐEN)
  // ==========================================
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
            },
          ]}
          numberOfLines={1}
        >
          {text}
        </Animated.Text>
        <Text style={styles.hintText}>(Nhấn đúp vào màn hình để tắt)</Text>
      </Pressable>
    );
  }

  // ==========================================
  // GIAO DIỆN 1: CÀI ĐẶT
  // ==========================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={false} barStyle="dark-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chữ Chạy LED</Text>
        <View style={styles.headerBtn} />
      </View>

      {/* --- NỘI DUNG CUỘN ĐƯỢC BỌC TRÁNH BÀN PHÍM --- */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Nội dung hiển thị</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="text-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: I LOVE YOU..."
                value={text}
                onChangeText={setText}
                placeholderTextColor="#C7C7CC"
              />
            </View>

            <Text style={styles.sectionLabel}>Tốc độ chạy</Text>
            <View style={styles.segmentedControl}>
              {speedOptions.map((opt) => {
                const isActive = speed === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                    onPress={() => setSpeed(opt.value)}
                  >
                    <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Màu sắc chữ</Text>
            <View style={styles.colorRow}>
              {colorOptions.map((color) => {
                const isActive = textColor === color;
                const isWhite = color === "#FFFFFF";
                return (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      isWhite && { borderWidth: 1, borderColor: "#D1D1D6" },
                      isActive && styles.colorCircleActive,
                    ]}
                    onPress={() => setTextColor(color)}
                  >
                    {isActive && (
                      <Ionicons name="checkmark" size={20} color={isWhite ? "#000" : "#FFF"} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.runBtn, !text.trim() && styles.runBtnDisabled]}
            onPress={handleRun}
            disabled={!text.trim()}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.runBtnText}>Bắt Đầu Chạy</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    // Fallback cho Android vì SafeAreaView chỉ hoạt động mặc định trên iOS
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10, // Bỏ paddingTop cứng, dùng paddingVertical để luôn cân đối
    backgroundColor: "#F2F2F7",
    zIndex: 10,
  },
  headerBtn: {
    width: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 10,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    height: "100%",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#E5E5EA",
    borderRadius: 10,
    padding: 3,
    marginBottom: 25,
    height: 40,
  },
  segmentBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  segmentTextActive: {
    fontWeight: "600",
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  colorCircleActive: {
    transform: [{ scale: 1.15 }],
  },
  runBtn: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  runBtnDisabled: {
    backgroundColor: "#B0D4FF",
    shadowOpacity: 0,
    elevation: 0,
  },
  runBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  runningContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    overflow: "hidden",
  },
  runningText: {
    fontSize: 140,
    fontWeight: "900",
  },
  hintText: {
    color: "rgba(255,255,255,0.3)",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    fontSize: 14,
  },
});