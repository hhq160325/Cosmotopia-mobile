import { StyleSheet } from "react-native"
import { Colors } from "../constants/Colors"
import { Spacing, BorderRadius, FontSize } from "../constants/Dimensions"

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Text styles
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
  },

  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.text,
    textAlign: "center",
  },

  body: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 24,
  },

  caption: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  // Button styles
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: Colors.background,
    fontSize: FontSize.md,
    fontWeight: "600",
  },

  secondaryButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: "500",
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },

  inputLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },

  // Layout styles
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  padding: {
    padding: Spacing.lg,
  },

  paddingHorizontal: {
    paddingHorizontal: Spacing.lg,
  },

  marginVertical: {
    marginVertical: Spacing.md,
  },

  // Shadow styles
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
