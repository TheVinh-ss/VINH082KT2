import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CT1Screen() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const lastTap = useRef(0);
  const blinkAnim = useRef(new Animated.Value(0)).current;

  // Hiệu ứng nhấp nháy vạch pin đỏ
  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(blinkAnim, { toValue: 0.1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      blinkAnim.setValue(0);
    }
  }, [isRunning]);

  // Nhấn đúp để quay lại màn hình Setup
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; 
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      setIsRunning(false); 
    } else {
      lastTap.current = now;
    }
  };

  // --- MÀN HÌNH 1: HIỂN THỊ NÚT RUN (UI MỚI) ---
  if (!isRunning) {
    return (
      <View style={styles.setupContainer}>
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <Ionicons name="battery-dead" size={32} color="#FF3B30" />
          </View>
          
          <Text style={styles.title}>Mô phỏng Hết pin</Text>
          <Text style={styles.subtitle}>Nhấn đúp vào màn hình đen để quay lại giao diện này.</Text>
          
          <TouchableOpacity style={styles.runButton} onPress={() => setIsRunning(true)}>
            <Text style={styles.runButtonText}>Run</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Quay về Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- MÀN HÌNH 2: GIAO DIỆN MÔ PHỎNG ĐEN THUI ---
  return (
    <Pressable style={styles.container} onPress={handleDoubleTap}>
      <StatusBar hidden={true} />

      {/* Cụm Pin */}
      <View style={styles.batteryContainer}>
        <View style={styles.batteryBody}>
          <Animated.View style={[styles.redBatteryLevel, { opacity: blinkAnim }]} />
        </View>
        <View style={styles.batteryTip} />
      </View>

      {/* Tia sét */}
      <Ionicons name="flash" size={28} color="rgba(255,255,255,0.4)" style={styles.lightning} />

      {/* Cụm Cáp sạc (Lightning xịn xò) */}
      <View style={styles.cableContainer}>
        
        {/* Đầu cắm kim loại & chân tiếp xúc vàng đồng */}
        <View style={styles.cableConnector}>
          <View style={styles.pin} />
          <View style={styles.pin} />
          <View style={styles.pin} />
          <View style={styles.pin} />
          <View style={styles.pin} />
        </View>

        {/* Củ bọc nhựa trắng */}
        <View style={styles.cableCasing}>
          <View style={styles.casingDetailLine} />
        </View>

        {/* Phần đệm chống đứt (Strain relief) */}
        <View style={styles.strainReliefTop} />
        <View style={styles.strainReliefBottom} />

        {/* Dây cáp */}
        <View style={styles.cableWire} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // STYLE MÀN HÌNH SETUP
  // ==========================================
  setupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  card: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 30,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },
  runButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  runButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#E5E5EA",
    alignItems: "center",
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // ==========================================
  // STYLE MÀN HÌNH MÔ PHỎNG (GIAO DIỆN ĐEN)
  // ==========================================
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  
  batteryContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 15 
  },
  batteryBody: { 
    width: 75, 
    height: 34, 
    borderWidth: 1.5, 
    borderColor: "rgba(255, 255, 255, 0.35)", 
    borderRadius: 6, 
    padding: 2,
    justifyContent: "center",
  },
  redBatteryLevel: { 
    width: "10%", 
    height: "85%", 
    backgroundColor: "#FF3B30", 
    borderRadius: 2 
  },
  batteryTip: { 
    width: 4, 
    height: 12, 
    backgroundColor: "rgba(255, 255, 255, 0.35)", 
    borderTopRightRadius: 3, 
    borderBottomRightRadius: 3 
  },
  
  lightning: { 
    marginBottom: 110 
  },
  
  // -- Cụm Cáp sạc (Đã làm lại đẹp hơn) --
  cableContainer: { 
    alignItems: "center", 
    position: "absolute", 
    bottom: 0 
  },
  // Đầu kim loại
  cableConnector: { 
    width: 18, 
    height: 20, 
    backgroundColor: "#B0B0B5", // Màu bạc kim loại
    borderTopLeftRadius: 4, 
    borderTopRightRadius: 4,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end", // Căn chân pin dính xuống dưới
    paddingBottom: 2,
    paddingHorizontal: 2,
    zIndex: 1,
  },
  // Chân đồng Lightning
  pin: {
    width: 1.5,
    height: 8,
    backgroundColor: "#D4AF37", // Màu vàng đồng
    borderRadius: 1,
  },
  // Nhựa bọc củ cáp
  cableCasing: { 
    width: 40, 
    height: 55, 
    backgroundColor: "#F2F2F7", // Trắng sữa hơi xám trong bóng tối
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginTop: -2, 
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  // Vệt lõm nhẹ trên củ cáp
  casingDetailLine: {
    width: 12,
    height: 2,
    backgroundColor: "#D1D1D6",
    borderRadius: 1,
  },
  // Đệm chống đứt cáp (Đoạn 1 to)
  strainReliefTop: {
    width: 24,
    height: 8,
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    marginTop: -1,
  },
  // Đệm chống đứt cáp (Đoạn 2 nhỏ)
  strainReliefBottom: {
    width: 16,
    height: 12,
    backgroundColor: "#D1D1D6",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginTop: -1,
  },
  // Dây xám/trắng mờ
  cableWire: { 
    width: 10, 
    height: 200, 
    backgroundColor: "#C7C7CC", 
    marginTop: -1,
  },
});