import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { AppContext } from '../context/AppContext';

// Reusable Modular Components
import OrderCard from '../components/OrderCard';
import ProductCard from '../components/ProductCard';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, wishlist, toggleWishlist } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('orders');
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const mockOrders = [
    {
      id: 'ORD-98210',
      date: 'May 14, 2026',
      total: 148.50,
      status: 'Delivered',
      items: 'Essence Handbag, Mascara',
      statusColor: '#10B981',
    },
    {
      id: 'ORD-43189',
      date: 'April 28, 2026',
      total: 89.90,
      status: 'Delivered',
      items: 'Classic Perfume, Moisturizer Cream',
      statusColor: '#10B981',
    },
    {
      id: 'ORD-22910',
      date: 'May 18, 2026',
      total: 210.00,
      status: 'In Transit',
      items: 'Designer Wooden Chair',
      statusColor: '#3B82F6',
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>{user?.avatar || '👤'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'guest@nirzo.com'}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>💎 VIP ELITE MEMBER</Text>
            </View>
          </View>
        </View>

        {/* Segmented Tab Controls */}
        <View style={styles.tabContainer}>
          {[
            { id: 'orders', label: 'Orders 📦' },
            { id: 'wishlist', label: `Wishlist ❤️ (${wishlist.length})` },
            { id: 'settings', label: 'Settings ⚙️' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Contents */}
        <View style={styles.contentContainer}>
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <View>
              {mockOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </View>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <View>
              {wishlist.length === 0 ? (
                <View style={styles.emptyTab}>
                  <Text style={styles.emptyTabIcon}>❤️</Text>
                  <Text style={styles.emptyTabTitle}>Your Wishlist is Empty</Text>
                  <Text style={styles.emptyTabSubtitle}>
                    Save items you love here to easily purchase them later.
                  </Text>
                </View>
              ) : (
                <View style={styles.wishlistGrid}>
                  {wishlist.map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      isFavorite={true}
                      onFavoritePress={() => toggleWishlist(item)}
                      onPress={() => navigation.navigate('ProductDetail', { product: item })}
                    />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <View style={styles.settingsCard}>
              <View style={styles.settingsRow}>
                <View>
                  <Text style={styles.settingsLabel}>Dark Mode (Mock)</Text>
                  <Text style={styles.settingsDesc}>Switch to dark mode layout theme</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#767577', true: Colors.primary }}
                  thumbColor={darkMode ? '#fff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingsDivider} />

              <View style={styles.settingsRow}>
                <View>
                  <Text style={styles.settingsLabel}>Push Notifications</Text>
                  <Text style={styles.settingsDesc}>Get notified about sales and updates</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#767577', true: Colors.primary }}
                  thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingsDivider} />

              <TouchableOpacity style={styles.settingsLinkRow}>
                <View>
                  <Text style={styles.settingsLabel}>Delivery Addresses</Text>
                  <Text style={styles.settingsDesc}>Manage your primary and secondary addresses</Text>
                </View>
                <Text style={styles.arrowIcon}>➔</Text>
              </TouchableOpacity>

              <View style={styles.settingsDivider} />

              <TouchableOpacity style={styles.settingsLinkRow}>
                <View>
                  <Text style={styles.settingsLabel}>Payment Methods</Text>
                  <Text style={styles.settingsDesc}>Manage saved cards and digital wallets</Text>
                </View>
                <Text style={styles.arrowIcon}>➔</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Sign Out Account</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0F2E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 40,
    textAlign: 'center',
    lineHeight: 70,
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C20',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  memberBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  memberBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 25,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: Colors.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  emptyTab: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTabIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  emptyTabTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C20',
  },
  emptyTabSubtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 40,
    lineHeight: 18,
  },
  wishlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1C20',
  },
  settingsDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  settingsLinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  arrowIcon: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  logoutBtn: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#FFF2F2',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD1D1',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ProfileScreen;
