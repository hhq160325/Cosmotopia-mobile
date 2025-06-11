import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateProductScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Product Screen</Text>
      <Text>This is where you'll add logic for creating new products.</Text>
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

export default CreateProductScreen; 