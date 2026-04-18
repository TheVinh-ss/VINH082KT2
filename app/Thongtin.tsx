import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ThongTinScreen() {
  const router = useRouter();
  
  // Hàm mở link Github với xử lý lỗi chắc chắn
  const openGithub = async () => {
    const url = "https://github.com/TheVinh-ss/VINH082KT2";
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Điện thoại không thể mở liên kết này: " + url);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có vấn đề khi mở trình duyệt!");
    }
  };

  // Đường dẫn ảnh đại diện
  const localAvatar = require("../img/91bb7ba34bf5caab93e4.jpg"); 

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} barStyle="dark-content" />

      {/* --- Thanh Header --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
          <Text style={styles.backText}>Trở về</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- Khung Ảnh đại diện & Tên --- */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={localAvatar} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.nameText}>Nguyễn Thế Vinh</Text>
          <Text style={styles.subText}>Hồ sơ Sinh viên</Text>
        </View>

        {/* --- Thẻ Thông tin chi tiết --- */}
        <View style={styles.infoCard}>
          
          {/* Hàng: Lớp */}
          <View style={styles.infoRow}>
            <View style={[styles.iconWrapper, { backgroundColor: "rgba(0, 122, 255, 0.1)" }]}>
              <Ionicons name="school" size={20} color="#007AFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Lớp</Text>
              <Text style={styles.infoValue}>CD DTTT23MT</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Hàng: MSSV */}
          <View style={styles.infoRow}>
            <View style={[styles.iconWrapper, { backgroundColor: "rgba(52, 199, 89, 0.1)" }]}>
              <Ionicons name="card" size={20} color="#34C759" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>MSSV</Text>
              <Text style={styles.infoValue}>0308231082</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Hàng: Sở thích */}
          <View style={styles.infoRow}>
            <View style={[styles.iconWrapper, { backgroundColor: "rgba(175, 82, 222, 0.1)" }]}>
              <Ionicons name="game-controller" size={20} color="#AF52DE" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Sở thích</Text>
              <Text style={styles.infoValue}>Lập trình, Chơi game</Text>
            </View>
          </View>

        </View>

        {/* --- Nút mở GitHub --- */}
        <TouchableOpacity 
          style={styles.githubButton} 
          onPress={openGithub} 
          activeOpacity={0.8}
        >
          <Ionicons name="logo-github" size={26} color="#FFF" style={{ marginRight: 15 }} />
          <View>
            <Text style={styles.githubButtonText}>Truy cập GitHub</Text>
            <Text style={styles.githubSubText}>github.com/TheVinh-ss/VINH082KT2</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F2F2F7", 
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "#F2F2F7",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 17,
    color: "#007AFF",
    fontWeight: "500",
    marginLeft: -5,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 15,
  },
  avatar: { 
    width: 130, 
    height: 130, 
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "#FFF",
  },
  nameText: { 
    fontSize: 28, 
    fontWeight: "700", 
    color: "#1C1C1E",
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: "#3A3A3C",
    fontWeight: "400",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "right",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#C7C7CC",
    marginLeft: 55,
  },
  githubButton: { 
    flexDirection: "row",
    backgroundColor: "#1B1F23",
    marginHorizontal: 20,
    paddingVertical: 14, 
    borderRadius: 16, 
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  githubButtonText: { 
    fontSize: 17, 
    fontWeight: "600",
    color: "#FFF",
  },
  githubSubText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    marginTop: 2,
  }
});
