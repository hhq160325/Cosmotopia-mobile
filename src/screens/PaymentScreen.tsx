import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Dimensions';
import { StorageService } from '../services/storageService';

const PaymentScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentCode, setPaymentCode] = useState('');

  const handleCreatePaymentLink = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ!');
      return;
    }
    setIsLoading(true);
    try {
      const token = await StorageService.getAuthToken();
      const response = await fetch('https://localhost:7191/api/Payment/create-payment-link', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Tạo link thanh toán thất bại');
      setPaymentLink(data.paymentUrl || data.url || '');
      Alert.alert('Thành công', 'Đã tạo link thanh toán!');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Tạo link thanh toán thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentCode) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã giao dịch hoặc mã xác nhận!');
      return;
    }
    setIsLoading(true);
    try {
      const token = await StorageService.getAuthToken();
      const response = await fetch('https://localhost:7191/api/Payment/payment', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentCode })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Thanh toán thất bại');
      Alert.alert('Thành công', 'Thanh toán thành công!');
      setPaymentCode('');
      setPaymentLink('');
      setAmount('');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Thanh toán thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số tiền (VND)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreatePaymentLink} disabled={isLoading}>
        <Ionicons name="link-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Tạo link thanh toán</Text>
      </TouchableOpacity>
      {paymentLink ? (
        <View style={styles.linkBox}>
          <Text style={styles.linkLabel}>Link thanh toán:</Text>
          <Text style={styles.linkValue}>{paymentLink}</Text>
          <View style={styles.qrBox}>
            <Text style={styles.qrLabel}>Quét mã QR để thanh toán:</Text>
            <View style={{ alignItems: 'center', marginVertical: 8 }}>
              <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentLink)}` }}
                style={{ width: 160, height: 160, borderRadius: 12, backgroundColor: '#fff' }}
              />
            </View>
          </View>
        </View>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Nhập mã giao dịch/mã xác nhận"
        value={paymentCode}
        onChangeText={setPaymentCode}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: Colors.success }]} onPress={handleConfirmPayment} disabled={isLoading}>
        <Ionicons name="checkmark-done-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    marginBottom: 18,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  linkBox: {
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  qrBox: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qrLabel: {
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  linkLabel: {
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  linkValue: {
    color: '#333',
    fontSize: 15,
  },
});

export default PaymentScreen; 