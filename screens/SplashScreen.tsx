import { View, StyleSheet, StatusBar } from "react-native"

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Logo area */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder} />
      </View>

      {/* Colorful bars at bottom */}
      <View style={styles.barsContainer}>
        <View style={[styles.bar, { backgroundColor: "#FF6B6B" }]} />
        <View style={[styles.bar, { backgroundColor: "#4ECDC4" }]} />
        <View style={[styles.bar, { backgroundColor: "#45B7D1" }]} />
        <View style={[styles.bar, { backgroundColor: "#96CEB4" }]} />
        <View style={[styles.bar, { backgroundColor: "#FFEAA7" }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f0f0",
    borderRadius: 40,
  },
  barsContainer: {
    flexDirection: "row",
    width: "100%",
    height: 8,
    marginBottom: 50,
  },
  bar: {
    flex: 1,
    height: "100%",
  },
})
