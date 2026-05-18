import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../theme';

const CartItemRow = ({ item, onRemove, onQtyDecrease, onQtyIncrease, showBorder = true }) => {
  const finalItemPrice = item.price * (1 - (item.discountPercentage || 0) / 100);

  return (
    <View style={[styles.cartItem, showBorder && styles.borderBottom]}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.itemImage}
        resizeMode="contain"
      />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemSpecs}>
          Size: <Text style={styles.specText}>{item.selectedSize}</Text>  |  Color:{' '}
          <Text style={styles.specText}>{item.selectedColor}</Text>
        </Text>
        <Text style={styles.itemPrice}>${finalItemPrice.toFixed(2)}</Text>
      </View>

      <View style={styles.actionColumn}>
        <TouchableOpacity style={styles.deleteBtn} onPress={onRemove} activeOpacity={0.7}>
          <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '700' }}>✕</Text>
        </TouchableOpacity>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onQtyDecrease} activeOpacity={0.7}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onQtyIncrease} activeOpacity={0.7}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C20',
  },
  itemSpecs: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  specText: {
    fontWeight: '600',
    color: '#4B5563',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 6,
  },
  actionColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  deleteBtn: {
    padding: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 3,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C20',
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1C20',
  },
});

export default CartItemRow;
