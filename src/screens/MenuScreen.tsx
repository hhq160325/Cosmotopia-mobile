import React, { useState } from "react"
import { View, Text, StyleSheet, TextInput, Alert, Image, TouchableWithoutFeedback } from "react-native"
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
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.cardContainer}>
          <Text style={styles.title}>Menu Options</Text>

          <CustomButton
            title="Profile"
            onPress={() => {
              navigation.navigate('Profile');
            }}
            variant="primary"
            style={styles.button}
          />

          <CustomButton
            title="Xem lịch sử mua hàng"
            onPress={() => {
              navigation.navigate('OrderHistory');
            }}
            variant="primary"
            style={styles.button}
          />

          <CustomButton
            title="Chi tiết đơn hàng"
            onPress={() => {
              navigation.navigate('OrderDetail');
            }}
            variant="primary"
            style={styles.button}
          />

          <CustomButton title="Đăng xuất" onPress={handleLogout} variant="secondary" style={styles.button} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '85%',
    maxWidth: 350,
    minHeight: 350,
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
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