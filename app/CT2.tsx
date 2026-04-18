import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
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

export default function CT2Screen() {
  const router = useRouter();

  // State lưu trữ dữ liệu nhập
  const [callerName, setCallerName] = useState("");
  const [callerLocation, setCallerLocation] = useState("");
  const [delayTime, setDelayTime] = useState("");
  
  // State quản lý Hình nền và Nhạc chuông
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [ringtoneUri, setRingtoneUri] = useState(null);

  // State quản lý luồng hiển thị & âm thanh
  const [isWaiting, setIsWaiting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [sound, setSound] = useState();

  const lastTap = useRef(0);
  const timerRef = useRef(null);

  // ==========================================
  // LẤY DỮ LIỆU ĐÃ LƯU KHI VỪA MỞ TRANG
  // ==========================================
  useEffect(() => {
    const loadDefaults = async () => {
      try {
        const name = await AsyncStorage.getItem("ct2_callerName");
        const loc = await AsyncStorage.getItem("ct2_callerLocation");
        const delay = await AsyncStorage.getItem("ct2_delayTime");
        const bg = await AsyncStorage.getItem("ct2_background");
        const ring = await AsyncStorage.getItem("ct2_ringtone");

        if (name) setCallerName(name);
        if (loc) setCallerLocation(loc);
        if (delay) setDelayTime(delay);
        if (bg) setBackgroundImage(bg);
        if (ring) setRingtoneUri(ring);
      } catch (e) {
        console.log("Lỗi tải dữ liệu", e);
      }
    };
    loadDefaults();

    // Dọn dẹp âm thanh khi thoát trang
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (sound) sound.unloadAsync();
    };
  }, []);

  // ==========================================
  // XỬ LÝ CÁC NÚT TÍNH NĂNG CHI TIẾT
  // ==========================================
  const saveDefaults = async () => {
    try {
      await AsyncStorage.setItem("ct2_callerName", callerName);
      await AsyncStorage.setItem("ct2_callerLocation", callerLocation);
      await AsyncStorage.setItem("ct2_delayTime", delayTime);
      if (backgroundImage) await AsyncStorage.setItem("ct2_background", backgroundImage);
      if (ringtoneUri) await AsyncStorage.setItem("ct2_ringtone", ringtoneUri);
      Alert.alert("Thành công", "Đã lưu thiết lập của bạn làm mặc định!");
    } catch (e) {
      Alert.alert("Lỗi", "Không thể lưu cài đặt.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16], // Tỉ lệ dọc của điện thoại
      quality: 1,
    });

    if (!result.canceled) {
      setBackgroundImage(result.assets[0].uri);
    }
  };

  const pickAudio = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
    });

    if (!result.canceled) {
      setRingtoneUri(result.assets[0].uri);
      Alert.alert("Thành công", "Đã chọn nhạc chuông mới!");
    }
  };

  // ==========================================
  // QUẢN LÝ CUỘC GỌI VÀ ÂM THANH
  // ==========================================
  const playRingtone = async () => {
    if (!ringtoneUri) return;
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: ringtoneUri },
        { isLooping: true }
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (e) {
      console.log("Không thể phát nhạc:", e);
    }
  };

  const stopCall = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsWaiting(false);
    setIsCalling(false);
  };

  const handleStart = () => {
    const delayMs = parseInt(delayTime) * 1000 || 0;
    setIsWaiting(true);

    timerRef.current = setTimeout(() => {
      setIsWaiting(false);
      setIsCalling(true);
      playRingtone();
    }, delayMs);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      stopCall();
    } else {
      lastTap.current = now;
    }
  };

  // ==========================================
  // GIAO DIỆN 2: CHỜ HOẶC CUỘC GỌI TỚI
  // ==========================================
  if (isWaiting || isCalling) {
    const CallBackground = backgroundImage ? ImageBackground : View;

    return (
      <Pressable style={styles.iphoneCallContainer} onPress={handleDoubleTap}>
        <StatusBar hidden={true} />

        {isCalling ? (
          <CallBackground 
            source={backgroundImage ? { uri: backgroundImage } : null} 
            style={styles.iphoneCallWrapper}
            blurRadius={backgroundImage ? 5 : 0} // Làm mờ nhẹ nền để nổi bật chữ
          >
            {/* Lớp phủ đen nhẹ nếu có hình nền để dễ đọc chữ */}
            {backgroundImage && <View style={styles.overlay} />}

            {/* --- Phần thông tin người gọi ở trên cùng --- */}
            <View style={[styles.topInfo, { zIndex: 2 }]}>
              <Text style={styles.iphoneCallerName} numberOfLines={1}>
                {callerName || "Không xác định"}
              </Text>
              <Text style={styles.iphoneCallerLocation}>
                {callerLocation || "di động"}
              </Text>
            </View>

            {/* --- Phần các nút hành động ở dưới --- */}
            <View style={[styles.bottomControls, { zIndex: 2 }]}>
              <View style={styles.extraActionsRow}>
                <View style={styles.extraActionBtn}>
                  <Ionicons name="alarm" size={26} color="#fff" />
                  <Text style={styles.extraActionText}>Nhắc tôi</Text>
                </View>
                <View style={styles.extraActionBtn}>
                  <Ionicons name="chatbubble" size={26} color="#fff" />
                  <Text style={styles.extraActionText}>Tin nhắn</Text>
                </View>
              </View>

              <View style={styles.mainActionsRow}>
                <TouchableOpacity style={styles.actionItem} activeOpacity={0.7} onPress={stopCall}>
                  <View style={[styles.circleButton, { backgroundColor: "#FF3B30" }]}>
                    <Ionicons
                      name="call"
                      size={36}
                      color="#fff"
                      style={{ transform: [{ rotate: "135deg" }] }}
                    />
                  </View>
                  <Text style={styles.actionItemText}>Từ chối</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} activeOpacity={0.7} onPress={stopCall}>
                  <View style={[styles.circleButton, { backgroundColor: "#34C759" }]}>
                    <Ionicons name="call" size={36} color="#fff" />
                  </View>
                  <Text style={styles.actionItemText}>Chấp nhận</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.hintCallText, { zIndex: 2 }]}>(Nhấn đúp vào màn hình để tắt)</Text>
          </CallBackground>
        ) : (
          <View style={styles.waitingView}>
            <Text style={styles.hintCallText}>(Đang chờ cuộc gọi... Nhấn đúp để hủy)</Text>
          </View>
        )}
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
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtnLeft}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cuộc gọi giả</Text>

        <TouchableOpacity onPress={handleStart} style={styles.headerBtnRight}>
          <Text style={styles.headerTextBtn}>Bắt đầu</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionTitle}>THÔNG TIN NGƯỜI GỌI</Text>
          <View style={styles.cardGroup}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Tên / Số ĐT</Text>
              <TextInput
                style={styles.input}
                value={callerName}
                onChangeText={setCallerName}
                placeholder="Ví dụ: Sếp, Mẹ, 098..."
                placeholderTextColor="#C7C7CC"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Nhãn / Nơi gọi</Text>
              <TextInput
                style={styles.input}
                value={callerLocation}
                onChangeText={setCallerLocation}
                placeholder="Ví dụ: di động, Hà Nội..."
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>CÀI ĐẶT THỜI GIAN</Text>
          <View style={styles.cardGroup}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Đếm ngược (giây)</Text>
              <TextInput
                style={styles.input}
                value={delayTime}
                onChangeText={setDelayTime}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          {/* Các nút tính năng thêm */}
          <View style={{ marginTop: 30 }}>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={saveDefaults}>
              <Ionicons name="star" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.primaryBtnText}>Lưu làm mặc định</Text>
            </TouchableOpacity>

            <View style={styles.rowBtns}>
              <TouchableOpacity 
                style={[styles.secondaryBtn, backgroundImage && { borderColor: '#007AFF', borderWidth: 1 }]} 
                activeOpacity={0.8} 
                onPress={pickImage}
              >
                <Ionicons name="image-outline" size={20} color="#007AFF" style={{ marginBottom: 5 }}/>
                <Text style={styles.secondaryBtnText}>{backgroundImage ? "Đã chọn ảnh" : "Đổi hình nền"}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.secondaryBtn, ringtoneUri && { borderColor: '#007AFF', borderWidth: 1 }]} 
                activeOpacity={0.8} 
                onPress={pickAudio}
              >
                <Ionicons name="musical-notes-outline" size={20} color="#007AFF" style={{ marginBottom: 5 }}/>
                <Text style={styles.secondaryBtnText}>{ringtoneUri ? "Đã chọn nhạc" : "Đổi nhạc chuông"}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={{marginTop: 15, alignItems: 'center'}}
              onPress={() => {
                setBackgroundImage(null);
                setRingtoneUri(null);
                Alert.alert("Đã xóa", "Đã xóa ảnh nền và nhạc chuông (quay về mặc định). Nhớ bấm 'Lưu làm mặc định' để lưu lại thay đổi nhé.");
              }}
            >
                <Text style={{color: '#FF3B30', fontSize: 14}}>Xóa ảnh nền / nhạc chuông đã chọn</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // =========================
  // GIAO DIỆN CÀI ĐẶT
  // =========================
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7", 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#F2F2F7",
  },
  headerBtnLeft: {
    width: 80,
    alignItems: "flex-start",
  },
  headerBtnRight: {
    width: 80,
    alignItems: "flex-end",
    paddingRight: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    flex: 1,
    textAlign: "center",
  },
  headerTextBtn: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 15,
  },
  cardGroup: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  inputLabel: {
    fontSize: 16,
    color: "#1C1C1E",
    width: 140, 
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#007AFF",
    textAlign: "right", 
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#C7C7CC",
    marginLeft: 16,
  },
  primaryBtn: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  rowBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  secondaryBtnText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },

  // =========================
  // GIAO DIỆN CUỘC GỌI
  // =========================
  iphoneCallContainer: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  waitingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iphoneCallWrapper: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: Platform.OS === "ios" ? 60 : 40,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  topInfo: {
    alignItems: "center",
    width: "100%",
  },
  iphoneCallerName: {
    color: "#FFF",
    fontSize: 38,
    fontWeight: "300",
    marginBottom: 6,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  iphoneCallerLocation: {
    color: "rgba(255, 255, 255, 0.7)", 
    fontSize: 18,
    fontWeight: "400",
  },
  bottomControls: {
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  extraActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  extraActionBtn: {
    alignItems: "center",
  },
  extraActionText: {
    color: "#FFF",
    marginTop: 8,
    fontSize: 15,
    fontWeight: "400",
  },
  mainActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  actionItem: {
    alignItems: "center",
  },
  circleButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionItemText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "400",
  },
  hintCallText: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 14,
    position: "absolute",
    bottom: 20,
  },
});