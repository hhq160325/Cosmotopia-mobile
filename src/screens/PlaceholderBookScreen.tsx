import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderBookScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Screen</Text>
      <Text>This is a placeholder for your book-related content.</Text>
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

export default PlaceholderBookScreen; 