import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Linking, RefreshControl } from 'react-native';

interface Video {
  videoId: string;
  title: string;
  description: string;
  videoUrl?: string;
  createdAt: string;
  isActive: boolean;
}

const PlaceholderKOLScreen = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://localhost:7191/api/KOLVideo/myVideos');
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(Array.isArray(data) ? data : (data.videos || []));
    } catch (err: any) {
      setError(err.message || 'Failed to load videos');
      setVideos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos();
  };

  const renderVideoItem = ({ item }: { item: Video }) => (
    <View style={styles.videoCard}>
      <Text style={styles.videoTitle}>{item.title}</Text>
      <Text style={styles.videoDesc}>{item.description}</Text>
      <Text style={styles.videoStatus}>
        Trạng thái: <Text style={{fontWeight:'bold'}}>{item.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Text>
      </Text>
      <Text style={styles.videoDate}>Ngày tạo: {new Date(item.createdAt).toLocaleString()}</Text>
      {item.videoUrl && typeof item.videoUrl === 'string' && (
        <TouchableOpacity onPress={() => item.videoUrl && Linking.openURL(item.videoUrl)}>
          <Text style={styles.videoLink}>Xem video</Text>
        </TouchableOpacity>
      )}
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý Video của bạn</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={fetchVideos}>
          <Text style={styles.reloadText}>Tải lại</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={item => item.videoId}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  reloadButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reloadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  listContainer: {
    padding: 16,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  videoDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  videoStatus: {
    fontSize: 12,
    color: '#8B5CF6',
    marginBottom: 2,
  },
  videoDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  videoLink: {
    color: '#4F46E5',
    fontWeight: 'bold',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default PlaceholderKOLScreen; 