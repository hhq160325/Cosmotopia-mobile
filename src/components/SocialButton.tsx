import type React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/Colors"
import { Spacing, BorderRadius, FontSize } from "../constants/Dimensions"

interface SocialButtonProps {
  provider: "google" | "facebook"
  onPress: () => void
}

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, onPress }) => {
  const getProviderConfig = () => {
    switch (provider) {
      case "google":
        return {
          icon: "logo-google" as const,
          text: "Tiếp tục với Google",
          color: Colors.google,
        }
      case "facebook":
        return {
          icon: "logo-facebook" as const,
          text: "Tiếp tục với Facebook",
          color: Colors.facebook,
        }
    }
  }

  const config = getProviderConfig()

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name={config.icon} size={20} color={config.color} />
      <Text style={styles.text}>{config.text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
    marginBottom: Spacing.sm,
  },
  text: {
    marginLeft: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: "500",
  },
})
