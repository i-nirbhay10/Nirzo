import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const SearchBar = ({
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  onFocus,
  editable = true,
  showClear = false,
  onClear,
  onFilterPress,
}) => {
  
  // Render Touchable Button mode if onFocus callback is provided (e.g. HomeScreen redirect button)
  if (onFocus) {
    return (
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.9}
          onPress={onFocus}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>{placeholder || 'Search products...'}</Text>
        </TouchableOpacity>
        
        {onFilterPress && (
          <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Render fully interactive TextInput mode otherwise (e.g. SearchScreen inputs)
  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder || 'Search products...'}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          returnKeyType="search"
          autoFocus={false}
        />
        
        {showClear && value && value.length > 0 && onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn} activeOpacity={0.7}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress} activeOpacity={0.8}>
          <Text style={{ fontSize: 18 }}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
});

export default SearchBar;
