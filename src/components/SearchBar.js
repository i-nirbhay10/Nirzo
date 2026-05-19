import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
          <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>{placeholder || 'Search products...'}</Text>
        </TouchableOpacity>
        
        {onFilterPress && (
          <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
            <Ionicons name="options-outline" size={20} color="#1A1C20" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Render fully interactive TextInput mode otherwise (e.g. SearchScreen inputs)
  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
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
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress} activeOpacity={0.8}>
          <Ionicons name="options-outline" size={20} color="#1A1C20" />
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
    marginRight: 8,
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
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
