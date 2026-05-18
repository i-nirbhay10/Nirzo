import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenHeader = ({ title, onBackPress, rightElement, showShadow = false }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.header, 
      { paddingTop: insets.top + 10 },
      showShadow && styles.shadow
    ]}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.arrowIcon}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyPlaceholder} />
      )}
      
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title || ''}
      </Text>
      
      {rightElement ? (
        <View style={styles.rightPlaceholder}>{rightElement}</View>
      ) : (
        <View style={styles.emptyPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C20',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 15,
  },
  backButton: {
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
  arrowIcon: {
    fontSize: 18,
    color: '#1A1C20',
    fontWeight: '800',
  },
  rightPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPlaceholder: {
    width: 40,
    height: 40,
  },
});

export default ScreenHeader;
