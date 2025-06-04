import type React from "react"
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native"
import { Colors } from "../constants/Colors"
import { Spacing, BorderRadius, FontSize } from "../constants/Dimensions"

interface CustomButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary"
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    variant === "primary" ? styles.primaryButton : styles.secondaryButton,
    disabled && styles.disabledButton,
    style,
  ]

  const buttonTextStyle = [
    styles.buttonText,
    variant === "primary" ? styles.primaryButtonText : styles.secondaryButtonText,
    disabled && styles.disabledButtonText,
    textStyle,
  ]

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled} activeOpacity={0.8}>
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: Colors.background,
  },
  secondaryButtonText: {
    color: Colors.text,
  },
  disabledButtonText: {
    color: Colors.textSecondary,
  },
})
