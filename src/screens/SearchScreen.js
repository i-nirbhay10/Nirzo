import React, { useState, useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme';
import { AppContext } from '../context/AppContext';

// Reusable Modular Components
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const {
    products,
    categories,
    recentSearches,
    addRecentSearch,
    toggleWishlist,
    isInWishlist,
  } = useContext(AppContext);

  const [searchText, setSearchText] = useState('');
  const [activeTabCategory, setActiveTabCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('default');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);

  // Pagination local state
  const [visibleCount, setVisibleCount] = useState(8);

  const handleSearchSubmit = () => {
    addRecentSearch(searchText);
  };

  const clearFilters = () => {
    setActiveTabCategory('all');
    setSelectedSort('default');
    setPriceRange('all');
    setMinRating(0);
    setVisibleCount(8);
  };

  // Perform advanced client-side searching, sorting, and filtering
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Text Search Filter
    if (searchText.trim() !== '') {
      const q = searchText.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (activeTabCategory !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === activeTabCategory.toLowerCase());
    }

    // 3. Price Filter
    if (priceRange === 'under-50') {
      result = result.filter((p) => p.price < 50);
    } else if (priceRange === '50-100') {
      result = result.filter((p) => p.price >= 50 && p.price <= 100);
    } else if (priceRange === 'over-100') {
      result = result.filter((p) => p.price > 100);
    }

    // 4. Rating Filter
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // 5. Sorting
    if (selectedSort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'discount') {
      result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    }

    return result;
  }, [products, searchText, activeTabCategory, selectedSort, priceRange, minRating]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const paginatedProducts = processedProducts.slice(0, visibleCount);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Modular Search Bar with Filter configurations */}
      <SearchBar
        placeholder="Search products, brands, tags..."
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          setVisibleCount(8);
        }}
        onSubmitEditing={handleSearchSubmit}
        showClear={true}
        onClear={() => setSearchText('')}
        onFilterPress={() => setFilterModalVisible(true)}
      />

      {/* Dynamic Category Badges */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isActive = activeTabCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryBadge, isActive && styles.categoryBadgeActive]}
                onPress={() => {
                  setActiveTabCategory(cat.id);
                  setVisibleCount(8);
                }}
              >
                <Text style={[styles.categoryBadgeText, isActive && styles.categoryBadgeTextActive]}>
                  {cat.icon} {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Feed */}
      <View style={{ flex: 1 }}>
        {searchText.length === 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentList}>
              {recentSearches.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.recentItem}
                  onPress={() => {
                    setSearchText(item);
                    addRecentSearch(item);
                  }}
                >
                  <Text style={styles.recentText}>🔍 {item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results Metadata Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            Showing {processedProducts.length} Results
          </Text>
          {(activeTabCategory !== 'all' || selectedSort !== 'default' || priceRange !== 'all' || minRating > 0) && (
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.resetText}>Reset Filters ✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {processedProducts.length === 0 ? (
          <ScrollView contentContainerStyle={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyTitle}>No Products Found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with another term or modifying your filter values.
            </Text>
            <TouchableOpacity style={styles.clearAllFiltersBtn} onPress={clearFilters}>
              <Text style={styles.clearAllFiltersBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <FlatList
            data={paginatedProducts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productList}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                isFavorite={isInWishlist(item.id)}
                onFavoritePress={() => toggleWishlist(item)}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              />
            )}
            ListFooterComponent={() =>
              visibleCount < processedProducts.length ? (
                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
                  <Text style={styles.loadMoreText}>Load More Products ➔</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ height: 40 }} />
              )
            }
          />
        )}
      </View>

      {/* Advanced Filters Modal Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters & Sorting</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm}>
              {/* Sort Section */}
              <Text style={styles.modalSectionTitle}>Sort By</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'default', label: 'Recommended ✨' },
                  { key: 'price-low', label: 'Price: Low to High 📈' },
                  { key: 'price-high', label: 'Price: High to Low 📉' },
                  { key: 'rating', label: 'Customer Rating ⭐' },
                  { key: 'discount', label: 'Biggest Discount % 🏷️' },
                ].map((sortOption) => {
                  const isSelected = selectedSort === sortOption.key;
                  return (
                    <TouchableOpacity
                      key={sortOption.key}
                      style={[styles.filterPill, isSelected && styles.filterPillActive]}
                      onPress={() => setSelectedSort(sortOption.key)}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          isSelected && styles.filterPillTextActive,
                        ]}
                      >
                        {sortOption.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Price Filter Section */}
              <Text style={styles.modalSectionTitle}>Price Range</Text>
              <View style={styles.filterOptions}>
                {[
                  { key: 'all', label: 'Any Price' },
                  { key: 'under-50', label: 'Under $50' },
                  { key: '50-100', label: '$50 to $100' },
                  { key: 'over-100', label: 'Above $100' },
                ].map((priceOption) => {
                  const isSelected = priceRange === priceOption.key;
                  return (
                    <TouchableOpacity
                      key={priceOption.key}
                      style={[styles.filterPill, isSelected && styles.filterPillActive]}
                      onPress={() => setPriceRange(priceOption.key)}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          isSelected && styles.filterPillTextActive,
                        ]}
                      >
                        {priceOption.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Rating Section */}
              <Text style={styles.modalSectionTitle}>Minimum Rating</Text>
              <View style={styles.filterOptions}>
                {[0, 3, 4, 4.5].map((ratingVal) => {
                  const isSelected = minRating === ratingVal;
                  return (
                    <TouchableOpacity
                      key={ratingVal}
                      style={[styles.filterPill, isSelected && styles.filterPillActive]}
                      onPress={() => setMinRating(ratingVal)}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          isSelected && styles.filterPillTextActive,
                        ]}
                      >
                        {ratingVal === 0 ? 'Any Rating ⭐️' : `${ratingVal}★ & Up ⭐️`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>

            {/* Modal Bottom Actions */}
            <View style={styles.modalBottomBar}>
              <TouchableOpacity
                style={styles.modalResetBtn}
                onPress={() => {
                  clearFilters();
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.modalResetBtnText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.modalApplyBtnText}>Apply Filters</Text>
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
  categoryScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  categoryBadgeActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryBadgeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoryBadgeTextActive: {
    color: '#fff',
  },
  recentContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
    marginBottom: 12,
  },
  recentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  recentText: {
    fontSize: 13,
    color: '#4B5563',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  resetText: {
    fontSize: 13,
    color: '#FF4757',
    fontWeight: '700',
  },
  productList: {
    paddingHorizontal: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadMoreButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginHorizontal: 5,
    marginVertical: 15,
    alignItems: 'center',
  },
  loadMoreText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C20',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  clearAllFiltersBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  clearAllFiltersBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C20',
  },
  modalCloseText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  modalForm: {
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1C20',
    marginTop: 15,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: 'rgba(39, 174, 96, 0.08)',
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: Colors.primary,
  },
  modalBottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  modalResetBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#F3F4F6',
  },
  modalResetBtnText: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 15,
  },
  modalApplyBtn: {
    flex: 2,
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalApplyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default SearchScreen;
