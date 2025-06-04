"use client"

import type React from "react"
import { useState } from "react"
import { View, TextInput, Text, TouchableOpacity, StyleSheet, type TextInputProps } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/Colors"
import { Spacing, BorderRadius, FontSize } from "../constants/Dimensions"

interface CustomInputProps extends TextInputProps {
  label: string
  error?: string
  isPassword?: boolean
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, error, isPassword = false, style, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput style={[styles.input, style]} secureTextEntry={isPassword && !showPassword} {...props} />
        {isPassword && (
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  eyeIcon: {
    padding: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
})
