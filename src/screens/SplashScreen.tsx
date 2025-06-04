import { View, Text, StyleSheet, StatusBar } from "react-native"
import { Colors } from "../constants/Colors"

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Logo area */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.appName}>Cosmotopia</Text>
        <Text style={styles.tagline}>Khám phá vũ trụ số</Text>
      </View>

      {/* Colorful bars at bottom */}
      <View style={styles.barsContainer}>
        <View style={[styles.bar, { backgroundColor: Colors.splashBar1 }]} />
        <View style={[styles.bar, { backgroundColor: Colors.splashBar2 }]} />
        <View style={[styles.bar, { backgroundColor: Colors.splashBar3 }]} />
        <View style={[styles.bar, { backgroundColor: Colors.splashBar4 }]} />
        <View style={[styles.bar, { backgroundColor: Colors.splashBar5 }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontStyle: "italic",
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
