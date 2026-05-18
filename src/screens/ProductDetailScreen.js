import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Spacing, Typography } from '../theme';

const ProductDetailScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Back Button and Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favButton}>
            <Text style={{ fontSize: 20 }}>❤️</Text>
          </TouchableOpacity>
        </View>

        {/* Product Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder} />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={Typography.h2}>Premium Leather Bag</Text>
            <Text style={styles.price}>$129.99</Text>
          </View>
          
          <Text style={styles.rating}>⭐ 4.8 (120 reviews)</Text>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>
            This premium leather bag is handcrafted from the finest materials. 
            It features a spacious main compartment, multiple pockets for organization, 
            and adjustable straps for maximum comfort. Perfect for daily use or travel.
          </Text>

          <View style={styles.sizeSection}>
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.sizeOptions}>
              {['S', 'M', 'L', 'XL'].map((size) => (
                <TouchableOpacity key={size} style={styles.sizeItem}>
                  <Text style={styles.sizeText}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  imagePlaceholder: {
    width: 300,
    height: 300,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  infoContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...Typography.h3,
    color: Colors.secondary,
  },
  rating: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  descriptionTitle: {
    ...Typography.h3,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  sectionTitle: {
    ...Typography.h3,
    marginTop: Spacing.lg,
  },
  sizeOptions: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  sizeItem: {
    width: 45,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  sizeText: {
    fontWeight: '600',
  },
  bottomBar: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 15,
    alignItems: 'center',
  },
  addToCartText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ProductDetailScreen;
