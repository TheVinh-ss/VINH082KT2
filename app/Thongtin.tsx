import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image, Linking,
    Platform,
    StatusBar,
    StyleSheet, Text, TouchableOpacity, View
} from "react-native";

export default function ThongTinScreen() {
  const router = useRouter();
  
  // Hàm mở link Github
  const openGithub = () => {
    Linking.openURL("https://github.com/Tencuaban");
  };


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
          <Text style={styles.infoLabel}>Lớp</Text>
          <Text style={styles.infoValue}>CD DTTT23MT</Text>
        </View>

        <View style={styles.divider} />

        {/* Hàng: MSSV */}
        <View style={styles.infoRow}>
          <View style={[styles.iconWrapper, { backgroundColor: "rgba(52, 199, 89, 0.1)" }]}>
            <Ionicons name="card" size={20} color="#34C759" />
          </View>
          <Text style={styles.infoLabel}>MSSV</Text>
          <Text style={styles.infoValue}>0308231082</Text>
        </View>

        <View style={styles.divider} />

        {/* Hàng: Sở thích */}
        <View style={styles.infoRow}>
          <View style={[styles.iconWrapper, { backgroundColor: "rgba(175, 82, 222, 0.1)" }]}>
            <Ionicons name="game-controller" size={20} color="#AF52DE" />
          </View>
          <Text style={styles.infoLabel}>Sở thích</Text>
          <Text style={styles.infoValue}>Lập trình, Chơi game</Text>
        </View>

      </View>

      {/* --- Nút mở GitHub --- */}
      <TouchableOpacity style={styles.githubButton} onPress={openGithub} activeOpacity={0.8}>
        <Ionicons name="logo-github" size={24} color="#FFF" style={{ marginRight: 10 }} />
        <Text style={styles.githubButtonText}>Truy cập GitHub</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F2F2F7",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 17,
    color: "#007AFF",
    fontWeight: "500",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 35,
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 15,
  },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  nameText: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#1C1C1E",
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  infoCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: "#3A3A3C",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    flexShrink: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginLeft: 50,
  },
  githubButton: { 
    flexDirection: "row",
    backgroundColor: "#24292E",
    marginHorizontal: 20,
    paddingVertical: 16, 
    borderRadius: 14, 
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  githubButtonText: { 
    fontSize: 18, 
    fontWeight: "600",
    color: "#FFF",
  }
});