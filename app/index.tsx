import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MENU</Text>

      {/* Nút CT1 */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("/CT1")}
      >
        <Text style={styles.buttonText}>CT1</Text>
      </TouchableOpacity>

      {/* Nút CT2 */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("/CT2")}
      >
        <Text style={styles.buttonText}>CT2</Text>
      </TouchableOpacity>

      {/* Nút CT3 */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("/CT3")}
      >
        <Text style={styles.buttonText}>CT3</Text>
      </TouchableOpacity>

      {/* Nút Thông tin */}
      <TouchableOpacity 
        style={[styles.button, styles.infoButton]} 
        onPress={() => router.push("/Thongtin")}
      >
        <Text style={styles.buttonText}>Thông tin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Màu nền nhẹ
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF", // Màu xanh dương cơ bản
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "60%", // Độ rộng của nút
    alignItems: "center",
    elevation: 3, // Tạo bóng đổ nhẹ trên Android
    shadowColor: "#000", // Bóng đổ trên iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  infoButton: {
    backgroundColor: "#28a745", // Đổi màu riêng cho nút Thông tin (Xanh lá)
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});