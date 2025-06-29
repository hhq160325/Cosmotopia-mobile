import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Dimensions';
import { ChatBubble } from './ChatBubble';

interface FloatingChatButtonProps {
  style?: any;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ style }) => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.floatingButton, style]}
        onPress={() => setIsChatVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color={Colors.background} />
      </TouchableOpacity>

      <ChatBubble
        isVisible={isChatVisible}
        onClose={() => setIsChatVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
}); 