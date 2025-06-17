import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Dimensions';
import { CustomButton } from '../components/CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
  
  const userName = 'admin'; 
  const userPhone = '0987677797';
  const userAddress = 'Q9,TP.ThuDuc,TP.HCM';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{userPhone}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{userAddress}</Text>
      </View>

      <CustomButton
        title="Back to Menu"
        onPress={() => navigation.navigate('BottomTabNavigator', { screen: 'MenuTab' })}
        variant="secondary"
        style={styles.button}
      />
    </View>
  );
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
  infoContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    width: '80%',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  value: {
    fontSize: 18,
    color: Colors.text,
  },
  button: {
    marginTop: Spacing.xl,
    width: '80%',
  },
}); 