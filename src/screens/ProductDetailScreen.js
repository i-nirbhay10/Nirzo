import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Colors } from '../theme';
import { AppContext } from '../context/AppContext';

// Reusable Modular Components
import ScreenHeader from '../components/ScreenHeader';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params || {};
  const { addToCart, toggleWishlist, isInWishlist } = useContext(AppContext);

  // States
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Off-White');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No product details found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const finalPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
  const isWishlisted = isInWishlist(product.id);

  // Handle Add to Cart action
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    Alert.alert(
      'Added to Cart! 🛒',
      `${quantity}x ${product.title} (${selectedSize} / ${selectedColor}) has been added to your shopping cart successfully.`,
      [
        {
          text: 'Continue Shopping',
          style: 'cancel',
        },
        {
          text: 'Go to Cart',
          onPress: () => navigation.navigate('Cart'),
        },
      ]
    );
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const mockColors = ['Off-White', 'Classic Teal', 'Midnight Black', 'Rose Gold'];

  return (
    <View style={styles.container}>
      {/* Reusable ScreenHeader */}
      <ScreenHeader
        title={product.brand || 'Product Details'}
        onBackPress={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity onPress={() => toggleWishlist(product)} style={styles.favButton} activeOpacity={0.8}>
            <Text style={{ fontSize: 18 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        }
      />

      {/* Dynamic Scroll View */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Dynamic Image Carousel Slider */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              if (slide !== activeImageIndex) {
                setActiveImageIndex(slide);
              }
            }}
            scrollEventThrottle={16}
          >
            {images.map((imgUrl, index) => (
              <View key={index} style={styles.slideWrapper}>
                <Image source={{ uri: imgUrl }} style={styles.productImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          {images.length > 1 && (
            <View style={styles.dotsRow}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    activeImageIndex === i ? styles.activeDot : null,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Promo Badges */}
          {product.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{Math.round(product.discountPercentage)}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View style={styles.infoCard}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>{product.category.toUpperCase()}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {product.rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.title}</Text>
          
          {/* Price Container */}
          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>${finalPrice.toFixed(2)}</Text>
            {product.discountPercentage > 0 && (
              <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
            )}
          </View>

          <Text style={styles.stockStatus}>
            Status: <Text style={{ color: product.stock > 5 ? '#10B981' : '#EF4444', fontWeight: '700' }}>
              {product.stock > 5 ? `In Stock (${product.stock} left)` : 'Low Stock'}
            </Text>
          </Text>

          {/* Description Section */}
          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          {/* Specifications Grid */}
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specificationsGrid}>
            <View style={styles.specCell}>
              <Text style={styles.specLabel}>Brand</Text>
              <Text style={styles.specVal}>{product.brand || 'Nirzo Premium'}</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specLabel}>Warranty</Text>
              <Text style={styles.specVal}>{product.warrantyInformation || '1 Year'}</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specLabel}>Shipping</Text>
              <Text style={styles.specVal}>{product.shippingInformation || 'Standard 3 days'}</Text>
            </View>
            <View style={styles.specCell}>
              <Text style={styles.specLabel}>Return Policy</Text>
              <Text style={styles.specVal}>{product.returnPolicy || '30 days return'}</Text>
            </View>
          </View>

          {/* Color Selection */}
          <Text style={styles.sectionTitle}>Select Color</Text>
          <View style={styles.optionsRow}>
            {mockColors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    isSelected ? styles.colorOptionActive : null,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {color}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Size Selection */}
          <Text style={styles.sectionTitle}>Select Size</Text>
          <View style={styles.optionsRow}>
            {['S', 'M', 'L', 'XL'].map((size) => {
              const isSelected = selectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    isSelected ? styles.sizeOptionActive : null,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Reviews List */}
          {product.reviews && product.reviews.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Customer Reviews ({product.reviews.length})</Text>
              {product.reviews.map((rev, idx) => (
                <View key={idx} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{rev.reviewerName}</Text>
                    <Text style={styles.reviewRating}>⭐ {rev.rating}★</Text>
                  </View>
                  <Text style={styles.reviewComment}>"{rev.comment}"</Text>
                  <Text style={styles.reviewDate}>{new Date(rev.date).toLocaleDateString()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Purchase Bar */}
      <View style={styles.bottomPurchaseBar}>
        {/* Quantity control */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Purchase button */}
        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart • ${(finalPrice * quantity).toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
    marginBottom: 20,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  favButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  carouselContainer: {
    width: width,
    height: 320,
    backgroundColor: '#fff',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideWrapper: {
    width: width,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  productImage: {
    width: '90%',
    height: '90%',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 14,
  },
  discountBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.02,
    shadowRadius: 15,
    elevation: 5,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  ratingBadge: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1C20',
    marginTop: 10,
    lineHeight: 30,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'through',
    marginLeft: 10,
    fontWeight: '600',
  },
  stockStatus: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
    marginTop: 25,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  specificationsGrid: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specCell: {
    width: '50%',
    padding: 8,
  },
  specLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  specVal: {
    fontSize: 13,
    color: '#1A1C20',
    fontWeight: '700',
    marginTop: 2,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginRight: 10,
    marginBottom: 10,
  },
  colorOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(39, 174, 96, 0.05)',
  },
  sizeOption: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  sizeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(39, 174, 96, 0.05)',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  optionTextActive: {
    color: Colors.primary,
  },
  reviewItem: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1C20',
  },
  reviewRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  reviewComment: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 6,
    fontStyle: 'italic',
  },
  reviewDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
  },
  bottomPurchaseBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C20',
  },
  qtyText: {
    marginHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
  },
  addToCartBtn: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ProductDetailScreen;
