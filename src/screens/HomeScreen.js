import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../theme';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '✨' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'fragrances', name: 'Fragrances', icon: '🌸' },
  { id: 'furniture', name: 'Furniture', icon: '🛋️' },
  { id: 'groceries', name: 'Groceries', icon: '🛒' },
];

const HomeScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products?limit=10');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === activeCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, Emily 👋</Text>
            <Text style={styles.subtitle}>What are you looking for today?</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationBtn}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <View style={styles.profilePic}>
              <Text style={{ fontSize: 24, textAlign: 'center', lineHeight: 40 }}>💠</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="ma"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Promo Card */}
        <View style={styles.promoContainer}>
          <View style={styles.promoBgCircle1} />
          <View style={styles.promoBgCircle2} />
          <View style={styles.promoContent}>
            <View style={styles.megaSaleBadge}>
              <Text style={styles.megaSaleText}>MEGA SALE</Text>
            </View>
            <Text style={styles.promoTitle}>Up to 40% Off</Text>
            <Text style={styles.promoSubtitle}>On selected items</Text>
            <TouchableOpacity style={styles.shopNowButton}>
              <Text style={styles.shopNowText}>Shop Now ➔</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/shopping-bag-4993510-4161877.png'}}
            style={styles.promoImage}
          />
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryList}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.categoryWrapper}
                onPress={() => setActiveCategory(cat.id)}
              >
                <View style={[styles.categoryIconContainer, isActive && styles.categoryIconActive]}>
                  <Text style={{ fontSize: 28 }}>{cat.icon}</Text>
                </View>
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Trending Now */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.productList}>
            {filteredProducts.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.thumbnail }} style={styles.productImage} resizeMode="contain" />
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{Math.round(item.discountPercentage || 10)}%</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                  </View>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.productBrand} numberOfLines={1}>{item.brand || item.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1C20',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  promoContainer: {
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    backgroundColor: '#27AE60',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoBgCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -20,
  },
  promoBgCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -30,
    left: 100,
  },
  promoContent: {
    flex: 1,
    zIndex: 1,
  },
  megaSaleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  megaSaleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  promoSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  shopNowButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  shopNowText: {
    color: '#27AE60',
    fontWeight: '700',
    fontSize: 13,
  },
  promoImage: {
    width: 100,
    height: 100,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C20',
  },
  seeAllText: {
    color: '#27AE60',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryWrapper: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryIconActive: {
    backgroundColor: '#27AE60',
  },
  categoryText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#27AE60',
    fontWeight: '700',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 55) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F7F9FB',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
  productInfo: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C20',
  },
  productBrand: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

export default HomeScreen;
