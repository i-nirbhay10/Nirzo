import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const PromoBanner = ({ discountPercent, title, subtitle, buttonText, imageUrl, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.promoContainer}
      activeOpacity={0.95}
      onPress={onPress}
    >
      <View style={styles.promoBgCircle1} />
      <View style={styles.promoBgCircle2} />
      <View style={styles.promoContent}>
        <View style={styles.megaSaleBadge}>
          <Text style={styles.megaSaleText}>MEGA OFFER</Text>
        </View>
        <Text style={styles.promoTitle}>Up to {discountPercent}% Off</Text>
        <Text style={styles.promoSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
        <View style={styles.shopNowButton}>
          <Text style={styles.shopNowText}>{buttonText} ➔</Text>
        </View>
      </View>
      <Image
        source={{ uri: imageUrl }}
        style={styles.promoImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  megaSaleText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 22,
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
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  shopNowText: {
    color: '#27AE60',
    fontWeight: '800',
    fontSize: 12,
  },
  promoImage: {
    width: 100,
    height: 100,
    zIndex: 1,
  },
});

export default PromoBanner;
