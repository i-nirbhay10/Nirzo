import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState({
    name: 'Nirbhay Verma',
    email: 'nirbhay.verma@nirzo.com',
    avatar: '💠',
    isLoggedIn: true,
  });

  // Products and Category State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All', icon: '✨' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'fragrances', name: 'Fragrances', icon: '🌸' },
    { id: 'furniture', name: 'Furniture', icon: '🛋️' },
    { id: 'groceries', name: 'Groceries', icon: '🛒' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success',
    buttons: [],
  });

  const showAlert = (title, message, buttons = [], type = 'success') => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttons,
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  // Cart and Wishlist State
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Search and Advanced Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['perfume', 'makeup', 'chair', 'coffee']);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 500],
    rating: 0,
    sortBy: 'default', // 'default', 'price-low', 'price-high', 'rating'
  });

  // Fetch initial products (limit to 50 for realistic mock-up data size)
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch products
      const response = await fetch('https://dummyjson.com/products?limit=50');
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data.products);

      // Fetch dynamic categories to enrich our category selection
      const catResponse = await fetch('https://dummyjson.com/products/categories');
      if (catResponse.ok) {
        const catData = await catResponse.json();
        // Keep our standard icons or map default icons for dynamic categories
        const iconMap = {
          'beauty': '💄',
          'fragrances': '🌸',
          'furniture': '🛋️',
          'groceries': '🛒',
          'home-decoration': '🪴',
          'laptops': '💻',
          'smartphones': '📱',
        };

        const enrichedCategories = [
          { id: 'all', name: 'All', icon: '✨' },
          ...catData.slice(0, 8).map(c => {
            const id = typeof c === 'object' ? c.slug : c;
            const name = typeof c === 'object' ? c.name : c.charAt(0).toUpperCase() + c.slice(1);
            return {
              id,
              name,
              icon: iconMap[id] || '🏷️'
            };
          })
        ];

        // Remove duplicates and set
        const uniqueCategories = enrichedCategories.reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error('Error fetching dynamic data:', err);
      setError('Could not connect to Nirzo Servers. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Authentication Flow
  const login = (email, password) => {
    if (email && password) {
      setUser({
        name: email.split('@')[0].toUpperCase(),
        email: email,
        avatar: '👤',
        isLoggedIn: true,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // Cart Operations
  const addToCart = (product, quantity = 1, size = 'M', color = 'Default') => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            ...product,
            quantity,
            selectedSize: size,
            selectedColor: color,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
  };

  const updateCartQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    const discountedPrice = item.price * (1 - (item.discountPercentage || 0) / 100);
    return total + discountedPrice * item.quantity;
  }, 0);

  // Wishlist Operations
  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const isExist = prevWishlist.some((item) => item.id === product.id);
      if (isExist) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Search History
  const addRecentSearch = (query) => {
    if (!query || query.trim() === '') return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 5); // Keep last 5 searches
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        products,
        categories,
        loading,
        error,
        fetchInitialData,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        filters,
        setFilters,
        alertConfig,
        showAlert,
        hideAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
