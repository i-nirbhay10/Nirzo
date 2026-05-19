import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

const ProductCard = ({ product, onPress, onFavoritePress, isFavorite, cardWidth }) => {
  const calculatedWidth = cardWidth || (screenWidth - 55) / 2;
  const finalPrice = product.price * (1 - (product.discountPercentage || 0) / 100);

  return (
    <TouchableOpacity
      style={[styles.productCard, { width: calculatedWidth }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.productImage}
          resizeMode="contain"
        />
        
        {onFavoritePress && (
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={onFavoritePress}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={14} 
              color={isFavorite ? '#EF4444' : '#1A1C20'} 
            />
          </TouchableOpacity>
        )}

        {product.discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{Math.round(product.discountPercentage)}%</Text>
          </View>
        )}
        
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#D97706" style={{ marginRight: 2 }} />
          <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productBrand} numberOfLines={1}>
          {product.brand || product.category.toUpperCase()}
        </Text>
        <Text style={styles.productName} numberOfLines={1}>
          {product.title}
        </Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>${finalPrice.toFixed(2)}</Text>
          {product.discountPercentage > 0 && (
            <Text style={styles.oldPrice}>${product.price.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 1,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#333',
    lineHeight: 12,
  },
  productInfo: {
    marginTop: 10,
    paddingHorizontal: 2,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C20',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 11,
    color: '#9CA3AF',
    textDecorationLine: 'through',
    marginLeft: 6,
  },
});

export default ProductCard;
