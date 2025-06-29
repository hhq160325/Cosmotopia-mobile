import React, { useState } from "react"
import { View, Text, StyleSheet, TextInput, Alert } from "react-native"
import { CustomButton } from "../components/CustomButton"
import { StorageService } from "../services/storageService"
import { Colors } from "../constants/Colors"
import { Spacing } from "../constants/Dimensions"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList, BottomTabParamList } from "../types/navigation"
import { CompositeNavigationProp, CommonActions } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type MenuScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'MenuTab'>,
  StackNavigationProp<RootStackParamList>
>

interface Props {
  navigation: MenuScreenNavigationProp
}

export default function MenuScreen({ navigation }: Props) {
  const [newBrandName, setNewBrandName] = useState('')

  const createBrand = async (name: string) => {
    try {
      const response = await fetch(
        "https://localhost:7191/api/Brand/CreateBrand",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // console.log("Brand created successfully:", data)
      Alert.alert("Success", `Brand '${name}' created successfully!`);
      // In a real app, you would also refetch brands here.
    } catch (error) {
      console.error("Failed to create brand:", error)
      Alert.alert("Error", "Failed to create brand.");
    }
  }

  const handleCreateBrand = async () => {
    if (newBrandName.trim() === '') {
      Alert.alert('Validation', 'Brand name cannot be empty!')
      return
    }
    await createBrand(newBrandName)
    setNewBrandName('') // Clear input after creation
  }

  const handleLogout = async () => {
    await StorageService.clearAuthData()
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Options</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new brand name"
        value={newBrandName}
        onChangeText={setNewBrandName}
      />
      <CustomButton title="Create New Brand" onPress={handleCreateBrand} variant="primary" style={styles.button} />

      <CustomButton
        title="AI Beauty Scanner"
        onPress={() => {
          navigation.navigate('ScannerTab'); // Navigate to the ScannerTab
        }}
        variant="primary"
        style={styles.button}
      />

      

      <CustomButton
        title="Profile"
        onPress={() => {
          navigation.navigate('Profile'); // Navigate to the Profile screen
        }}
        variant="primary"
        style={styles.button}
      />

      <CustomButton title="Đăng xuất" onPress={handleLogout} variant="secondary" style={styles.button} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.xl,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    width: '100%',
    fontSize: 16,
  },
  button: {
    marginTop: Spacing.md,
    minWidth: 200,
    width: '100%',
  },
}) 