import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Screen</Text>
      <Text>This is a placeholder for your list content.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PlaceholderListScreen; 