import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme';
import { AppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const { loading } = useContext(AppContext);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;      // Fade in splash content
  const scaleAnim = useRef(new Animated.Value(0.8)).current;   // Scale logo
  const translateAnim = useRef(new Animated.Value(30)).current; // Translate text upwards
  const textFadeAnim = useRef(new Animated.Value(0)).current;  // Fade in text
  const pulseAnim = useRef(new Animated.Value(1)).current;     // Continuous pulse for loading
  const exitFadeAnim = useRef(new Animated.Value(1)).current;  // Container fade out on exit

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 15,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Pulse loading animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Track product loading completion
  useEffect(() => {
    if (!loading) {
      setDataLoaded(true);
    }
  }, [loading]);

  // Handle transition out
  useEffect(() => {
    if (dataLoaded) {
      // Keep splash for at least 2.5 seconds for branding effect
      const timer = setTimeout(() => {
        Animated.timing(exitFadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          if (onFinish) {
            onFinish();
          }
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [dataLoaded]);

  return (
    <Animated.View style={[styles.container, { opacity: exitFadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1C20" />
      
      {/* Background Ambient Glow */}
      <View style={styles.ambientGlow} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Diamond Styled Logo Icon Container */}
        <Animated.View style={[styles.logoIconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="cart" size={45} color={Colors.white} />
        </Animated.View>

        {/* Main Branding Text */}
        <Animated.View style={{ transform: [{ translateY: translateAnim }], opacity: textFadeAnim }}>
          <Text style={styles.appName}>NIRZO</Text>
          <Text style={styles.tagline}>Elevate Your Shopping Experience</Text>
        </Animated.View>
      </Animated.View>

      {/* Modern Horizontal Loading Indicator */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {loading ? 'Initializing catalog...' : 'Ready to explore'}
        </Text>
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { 
                width: dataLoaded ? '100%' : '65%',
                backgroundColor: dataLoaded ? Colors.primary : Colors.primary
              } 
            ]} 
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1C20', // Premium Dark/Charcoal background
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: 'rgba(39, 174, 96, 0.08)', // Tinted primary color glow
    filter: 'blur(80px)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 10,
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '60%',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default SplashScreen;
