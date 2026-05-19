import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { AppContext } from '../context/AppContext';

// Reusable Modular Components
import CartItemRow from '../components/CartItemRow';

const CartScreen = ({ navigation }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    showAlert,
  } = useContext(AppContext);

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  // Apply Coupon Logic
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'NIRZO20') {
      setDiscountPercent(20);
      setCouponSuccess('20% discount applied successfully! 🎉');
      setCouponError('');
    } else if (code === 'WELCOME10') {
      setDiscountPercent(10);
      setCouponSuccess('10% discount applied successfully! 🎉');
      setCouponError('');
    } else if (code === '') {
      setCouponError('Please enter a coupon code.');
      setCouponSuccess('');
    } else {
      setCouponError('Invalid coupon code. Try NIRZO20.');
      setCouponSuccess('');
    }
  };

  // Pricing Calculations
  const shippingFee = cartTotal > 150 ? 0 : cart.length > 0 ? 9.99 : 0;
  const discountAmount = cartTotal * (discountPercent / 100);
  const estimatedTax = cartTotal * 0.08;
  const grandTotal = cartTotal - discountAmount + shippingFee + estimatedTax;

  const handleCheckout = () => {
    setCheckoutModalVisible(true);
  };

  const confirmCheckoutOrder = () => {
    setCheckoutModalVisible(false);
    clearCart();
    setCouponCode('');
    setDiscountPercent(0);
    setCouponSuccess('');
    showAlert(
      'Order Confirmed!',
      'Thank you for shopping with Nirzo. Your order has been placed successfully and is being processed.',
      [{ text: 'Great', onPress: () => navigation.navigate('HomeTab') }],
      'success'
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart ({cart.length})</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added anything to your cart yet. Discover hot deals and add items.
          </Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.shopNowBtnText}>Explore Products ➔</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Cart Items List using Reusable Row component */}
            <View style={styles.itemsCard}>
              {cart.map((item, idx) => (
                <CartItemRow
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  item={item}
                  showBorder={idx < cart.length - 1}
                  onRemove={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                  onQtyDecrease={() =>
                    updateCartQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                  }
                  onQtyIncrease={() =>
                    updateCartQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                  }
                />
              ))}
            </View>

            {/* Promo / Coupon Section */}
            <View style={styles.promoSection}>
              <Text style={styles.sectionTitle}>Have a Coupon Code?</Text>
              <View style={styles.promoInputRow}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter code (e.g. NIRZO20)"
                  placeholderTextColor="#888"
                  value={couponCode}
                  onChangeText={(text) => {
                    setCouponCode(text);
                    setCouponError('');
                  }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.promoApplyBtn} onPress={handleApplyCoupon}>
                  <Text style={styles.promoApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {couponError.length > 0 && <Text style={styles.errorText}>{couponError}</Text>}
              {couponSuccess.length > 0 && <Text style={styles.successText}>{couponSuccess}</Text>}
            </View>

            {/* Price Breakdown / Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
              </View>

              {discountPercent > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Coupon Discount ({discountPercent}%)</Text>
                  <Text style={[styles.summaryValue, { color: '#10B981' }]}>-${discountAmount.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping Fee</Text>
                <Text style={styles.summaryValue}>
                  {shippingFee === 0 ? <Text style={{ color: '#10B981', fontWeight: '700' }}>FREE</Text> : `$${shippingFee.toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated Tax (8%)</Text>
                <Text style={styles.summaryValue}>${estimatedTax.toFixed(2)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={[styles.summaryRow, { marginTop: 5 }]}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Checkout Bottom Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.totalSumContainer}>
              <Text style={styles.bottomBarLabel}>Total Amount</Text>
              <Text style={styles.bottomBarVal}>${grandTotal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Checkout ➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Checkout details Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={checkoutModalVisible}
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderTitle}>Order Checkout Details</Text>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Delivery Address:</Text>
              <Text style={styles.modalValue}>124, Platinum Towers, Tech City, NY</Text>

              <Text style={styles.modalLabel}>Payment Method:</Text>
              <Text style={styles.modalValue}>Nirzo Pay Wallet (•••• 4920)</Text>

              <Text style={styles.modalLabel}>Estimated Delivery:</Text>
              <Text style={styles.modalValue}>Standard Shipping (2 - 4 Days)</Text>

              <View style={styles.modalPricingCard}>
                <Text style={styles.modalPricingText}>Total Items: {cart.reduce((t, i) => t + i.quantity, 0)}</Text>
                <Text style={styles.modalPricingTotal}>Total Bill: ${grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setCheckoutModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={confirmCheckoutOrder}
              >
                <Text style={styles.modalConfirmBtnText}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1C20',
  },
  clearAllText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  itemsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  promoSection: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C20',
    marginBottom: 12,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    height: 46,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1A1C20',
  },
  promoApplyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  promoApplyText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  successText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C20',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalSumContainer: {
    justifyContent: 'center',
  },
  bottomBarLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  bottomBarVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 70,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1C20',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  shopNowBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  shopNowBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C20',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginTop: 10,
  },
  modalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1C20',
    marginTop: 4,
  },
  modalPricingCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalPricingText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalPricingTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalCancelBtnText: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 14,
  },
  modalConfirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default CartScreen;
