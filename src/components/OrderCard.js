import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors } from '../theme';

const OrderCard = ({ order }) => {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={[styles.statusTag, { backgroundColor: order.statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: order.statusColor }]}>{order.status}</Text>
        </View>
      </View>
      <Text style={styles.orderItems}>{order.items}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderDate}>{order.date}</Text>
        <Text style={styles.orderTotal}>Total: ${order.total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C20',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderItems: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 10,
    lineHeight: 18,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});

export default OrderCard;
