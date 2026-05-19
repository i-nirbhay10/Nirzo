import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme';
import { AppContext } from '../context/AppContext';

// Reusable Modular Components
import SearchBar from '../components/SearchBar';
import PromoBanner from '../components/PromoBanner';
import ProductCard from '../components/ProductCard';

const HomeScreen = ({ navigation }) => {
  const {
    user,
    products,
    categories,
    loading,
    error,
    fetchInitialData,
    toggleWishlist,
    isInWishlist,
    setFilters,
  } = useContext(AppContext);

  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategoryPress = (categoryId) => {
    setActiveCategory(categoryId);
    setFilters((prev) => ({ ...prev, category: categoryId }));
  };

  const handleSearchBarFocus = () => {
    navigation.navigate('Search');
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  const promoProduct = products.reduce((max, current) => {
    return (current.discountPercentage || 0) > (max.discountPercentage || 0) ? current : max;
  }, { discountPercentage: 0 });

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name.split(' ')[0] || 'Guest'} 👋</Text>
            <Text style={styles.subtitle}>Discover premium collections today!</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationBtn} onPress={() => navigation.navigate('Cart')}>
              <Ionicons name="notifications-outline" size={22} color="#1A1C20" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profilePic} onPress={() => navigation.navigate('Profile')}>
              <Text style={{ fontSize: 24, textAlign: 'center', lineHeight: 40 }}>{user?.avatar || '💠'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modular Search Bar Redirector */}
        <SearchBar
          placeholder="Search products, categories, styles..."
          onFocus={handleSearchBarFocus}
          editable={false}
        />

        {/* Modular Promotional Banner */}
        {products.length > 0 && (
          <PromoBanner
            discountPercent={Math.round(promoProduct.discountPercentage || 25)}
            title={`Up to ${Math.round(promoProduct.discountPercentage || 25)}% Off`}
            subtitle={`On our luxurious ${promoProduct.title || 'Collection'}`}
            buttonText="Grab Deal"
            imageUrl={promoProduct.thumbnail || 'https://cdn3d.iconscout.com/3d/premium/thumb/shopping-bag-4993510-4161877.png'}
            onPress={() => promoProduct.id && navigation.navigate('ProductDetail', { product: promoProduct })}
          />
        )}

        {/* Categories Horizontal Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.categoryWrapper}
                onPress={() => handleCategoryPress(cat.id)}
              >
                <View style={[styles.categoryIconContainer, isActive && styles.categoryIconActive]}>
                  <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
                </View>
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Connectivity Error Handling */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchInitialData}>
              <Text style={styles.retryBtnText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trending Feed Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.seeAllText}>Filters ➔</Text>
          </TouchableOpacity>
        </View>
        
        {/* Loading Spinner or Modular Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Fetching products from Nirzo Servers...</Text>
          </View>
        ) : (
          <View style={styles.productList}>
            {filteredProducts.slice(0, 10).map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isFavorite={isInWishlist(item.id)}
                onFavoritePress={() => toggleWishlist(item)}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
    fontSize: 13,
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
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C20',
  },
  seeAllText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  categoryList: {
    paddingHorizontal: 20,
  },
  categoryWrapper: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  categoryIconActive: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
  },
});

export default HomeScreen;
