import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions, Platform, Alert, Modal, TextInput } from 'react-native';
import { StorageService } from '../services/storageService';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { API_CONFIG } from '../config/api';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Video {
  videoId: string;
  title: string;
  description: string;
  videoUrl?: string;
  createdAt: string;
  isActive: boolean;
}

const VideoPlayerWrapper = ({ uri, paused }: { uri: string, paused: boolean }) => {
  if (Platform.OS === 'web') return null;
  // Chỉ require khi không phải web
  const VideoPlayer = require('react-native-video').default;
  return (
    <VideoPlayer
      source={{ uri }}
      style={styles.nativeVideo}
      resizeMode="cover"
      repeat
      paused={paused}
      muted={false}
      controls={false}
    />
  );
};

const PlaceholderKOLScreen = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{ title: string; description: string; file: any | null }>({ title: '', description: '', file: null });
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await StorageService.getAuthToken();
      if (!token) {
        setError('Vui lòng đăng nhập để xem video');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KOL_VIDEO_MY_VIDEOS}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        await StorageService.clearAuthData();
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
        setLoading(false);
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(Array.isArray(data) ? data : (data.videos || []));
    } catch (err: any) {
      setError(err.message || 'Failed to load videos');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 });

  // Upload video
  const handlePickFile = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setFormData(prev => ({ ...prev, file: file }));
        }
      };
      input.click();
    } else {
      try {
        const DocumentPicker = require('expo-document-picker');
        const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
        if (!result.canceled && result.assets && result.assets[0]) {
          setFormData(prev => ({ ...prev, file: result.assets[0] }));
        }
      } catch (err) {
        Alert.alert('Lỗi', 'Không thể chọn file video.');
      }
    }
  };

  const handleUpload = async () => {
    if (!formData.title || !formData.description || !formData.file) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đủ tiêu đề, mô tả và chọn file video.');
      return;
    }
    try {
      const token = await StorageService.getAuthToken();
      if (!token) throw new Error('Chưa đăng nhập');
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('file', {
        uri: formData.file.uri,
        name: formData.file.name || 'video.mp4',
        type: formData.file.mimeType || 'video/mp4',
      } as any);
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KOL_VIDEO_UPLOAD}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: form,
      });
      if (!response.ok) throw new Error('Tải lên video thất bại');
      Alert.alert('Thành công', 'Đã tải lên video!');
      setModalVisible(false);
      setFormData({ title: '', description: '', file: null });
      fetchVideos();
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Tải lên video thất bại');
    }
  };

  // Delete video
  const handleDelete = async (videoId: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa video này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: async () => {
        try {
          const token = await StorageService.getAuthToken();
          if (!token) throw new Error('Chưa đăng nhập');
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KOL_VIDEO_DELETE}/${videoId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Xóa video thất bại');
          Alert.alert('Đã xóa video!');
          fetchVideos();
        } catch (err: any) {
          Alert.alert('Lỗi', err.message || 'Xóa video thất bại');
        }
      }}
    ]);
  };

  // Update video
  const openEditModal = (video: Video) => {
    setIsEditing(true);
    setEditingVideo(video);
    setFormData({ title: video.title, description: video.description, file: null });
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingVideo) return;
    if (!formData.title || !formData.description) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đủ tiêu đề và mô tả.');
      return;
    }
    try {
      const token = await StorageService.getAuthToken();
      if (!token) throw new Error('Chưa đăng nhập');
      const body: any = {
        title: formData.title,
        description: formData.description,
      };
      if (formData.file) {
        const form = new FormData();
        form.append('title', formData.title);
        form.append('description', formData.description);
        form.append('file', {
          uri: formData.file.uri,
          name: formData.file.name || 'video.mp4',
          type: formData.file.mimeType || 'video/mp4',
        } as any);
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KOL_VIDEO_UPDATE}/${editingVideo.videoId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: form,
        });
        if (!response.ok) throw new Error('Cập nhật video thất bại');
        Alert.alert('Cập nhật thành công!');
        setModalVisible(false);
        setEditingVideo(null);
        setFormData({ title: '', description: '', file: null });
        fetchVideos();
        return;
      }
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.KOL_VIDEO_UPDATE}/${editingVideo.videoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Cập nhật video thất bại');
      Alert.alert('Cập nhật thành công!');
      setModalVisible(false);
      setEditingVideo(null);
      setFormData({ title: '', description: '', file: null });
      fetchVideos();
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Cập nhật video thất bại');
    }
  };

  // Show menu for video actions
  const showVideoMenu = (video: Video) => {
    Alert.alert(
      video.title,
      'Chọn hành động:',
      [
        { text: 'Sửa video', onPress: () => openEditModal(video) },
        { text: 'Xóa video', style: 'destructive', onPress: () => handleDelete(video.videoId) },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  const renderVideoItem = ({ item, index }: { item: Video; index: number }) => (
    <View style={styles.videoContainer}>
      {item.videoUrl ? (
        Platform.OS === 'web' ? (
          <video
            src={item.videoUrl}
            style={{ width: '100vw', height: '100vh', objectFit: 'cover', backgroundColor: '#000' }}
            controls
            autoPlay={index === currentIndex}
            loop
            muted
          />
        ) : (
          <VideoPlayerWrapper uri={item.videoUrl} paused={index !== currentIndex} />
        )
      ) : (
        <View style={[styles.nativeVideo, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }]}> 
          <Text>Không có video</Text>
        </View>
      )}
      <View style={styles.overlayInfo}>
        <Text style={styles.videoTitle}>{item.title}</Text>
        <Text style={styles.videoDesc}>{item.description}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Like!')}>
            <Text style={styles.actionText}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Comment!')}>
            <Text style={styles.actionText}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Share!')}>
            <Text style={styles.actionText}>🔗</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => showVideoMenu(item)}>
            <MaterialIcons name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchVideos}>
          <Text style={styles.reloadText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video của tôi</Text>
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={() => { 
            setModalVisible(true); 
            setIsEditing(false); 
            setFormData({ title: '', description: '', file: null }); 
          }}
        >
          <MaterialIcons name="cloud-upload" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={item => item.videoId}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        getItemLayout={(_, index) => ({ length: SCREEN_HEIGHT, offset: SCREEN_HEIGHT * index, index })}
        style={{ backgroundColor: '#000' }}
      />
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Cập nhật video' : 'Tải lên video mới'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Tiêu đề video"
              value={formData.title}
              onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Mô tả video"
              value={formData.description}
              onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
              multiline
            />
            <TouchableOpacity style={styles.pickFileButton} onPress={handlePickFile}>
              <Text style={styles.pickFileText}>{formData.file ? `Đã chọn: ${formData.file.name}` : 'Chọn file video'}</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <TouchableOpacity style={[styles.modalActionButton, { backgroundColor: '#718096' }]} onPress={() => { setModalVisible(false); setEditingVideo(null); setFormData({ title: '', description: '', file: null }); }}>
                <Text style={styles.actionText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalActionButton, { backgroundColor: '#8B5CF6' }]} onPress={isEditing ? handleUpdate : handleUpload}>
                <Text style={styles.actionText}>{isEditing ? 'Cập nhật' : 'Tải lên'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  nativeVideo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlayInfo: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  videoTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
  },
  videoDesc: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 18,
  },
  actionButton: {
    marginRight: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
    padding: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  reloadButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  reloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  menuButton: {
    marginLeft: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  pickFileButton: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  pickFileText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
});

export default PlaceholderKOLScreen; 